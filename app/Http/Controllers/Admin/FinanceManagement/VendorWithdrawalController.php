<?php

namespace App\Http\Controllers\Admin\FinanceManagement;

use App\Enums\WithdrawalStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FinanceManagement\RejectWithdrawalRequest;
use App\Models\VendorWithdrawal;
use App\Notifications\VendorGenericNotification;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Inertia\Response;

class VendorWithdrawalController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'pending');
        $query = VendorWithdrawal::query()
            ->with(['vendor:id,first_name,last_name,shop_name,email', 'payoutAccount:id,vendor_id,account_holder_name,account_type']);

        if ($tab === 'pending') {
            $query->where('status', WithdrawalStatus::Pending);
        } elseif ($tab === 'in_progress') {
            $query->whereIn('status', [WithdrawalStatus::Approved, WithdrawalStatus::Processing]);
        } elseif ($tab === 'completed') {
            $query->where('status', WithdrawalStatus::Completed);
        } elseif ($tab === 'rejected') {
            $query->where('status', WithdrawalStatus::Rejected);
        }
        // tab === 'all' → no status filter

        $search = $request->input('search');
        if (is_string($search) && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('amount', 'like', "%{$search}%")
                    ->orWhere('note', 'like', "%{$search}%")
                    ->orWhereHas('vendor', function ($v) use ($search) {
                        $v->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('shop_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => [],
            'filterable' => ['status'],
            'sortable' => ['id', 'amount', 'created_at', 'status'],
        ]);

        $withdrawals = array_map(function (VendorWithdrawal $w) {
            $vendor = $w->vendor;
            $vendorName = $vendor->full_name ?? $vendor->shop_name ?? 'N/A';

            return [
                'id' => Crypt::encryptString($w->id),
                'vendor_id' => $w->vendor_id,
                'vendor_name' => $vendorName,
                'vendor_email' => $vendor->email ?? null,
                'amount' => (float) $w->amount,
                'note' => $w->note,
                'status' => $w->status->value,
                'status_label' => $w->status->label(),
                'created_at' => $w->created_at?->toIso8601String(),
                'reviewed_at' => $w->reviewed_at?->toIso8601String(),
                'processed_at' => $w->processed_at?->toIso8601String(),
                'rejection_reason' => $w->rejection_reason,
            ];
        }, $result['data']);

        $withdrawalStatuses = array_map(
            fn (WithdrawalStatus $s) => ['value' => $s->value, 'label' => $s->label()],
            WithdrawalStatus::cases()
        );

        return Inertia::render('admin/finance-management/withdrawals/index', [
            'withdrawals' => $withdrawals,
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'tab' => $tab,
            'withdrawalStatuses' => $withdrawalStatuses,
        ]);
    }

    public function show(string $id): Response
    {
        $withdrawalId = Crypt::decryptString($id);
        $withdrawal = VendorWithdrawal::findOrFail($withdrawalId);
        $withdrawal->load([
            'vendor:id,first_name,last_name,shop_name,email,phone,address,city,region_state',
            'payoutAccount:id,vendor_id,account_holder_name,account_type,account_number,bank_name,routing_number,email',
            'reviewer:id,first_name,last_name',
        ]);

        $vendor = $withdrawal->vendor;
        $vendorName = $vendor->full_name ?? $vendor->shop_name ?? 'N/A';

        $payoutAccount = $withdrawal->payoutAccount;
        $maskedNumber = $payoutAccount && $payoutAccount->account_number
            ? str_repeat('•', max(0, strlen($payoutAccount->account_number) - 4)).substr($payoutAccount->account_number, -4)
            : null;

        return Inertia::render('admin/finance-management/withdrawals/show', [
            'withdrawal' => [
                'id' => $withdrawal->id,
                'vendor_id' => $withdrawal->vendor_id,
                'vendor_name' => $vendorName,
                'vendor_email' => $vendor->email ?? null,
                'vendor_phone' => $vendor->phone ?? null,
                'vendor_address' => trim(($vendor->address ?? '').', '.($vendor->city ?? '').', '.($vendor->region_state ?? ''), ', '),
                'amount' => (float) $withdrawal->amount,
                'note' => $withdrawal->note,
                'status' => $withdrawal->status->value,
                'status_label' => $withdrawal->status->label(),
                'created_at' => $withdrawal->created_at?->toIso8601String(),
                'reviewed_at' => $withdrawal->reviewed_at?->toIso8601String(),
                'processed_at' => $withdrawal->processed_at?->toIso8601String(),
                'rejection_reason' => $withdrawal->rejection_reason,
                'reviewer_name' => $withdrawal->reviewer
                    ? trim(($withdrawal->reviewer->first_name ?? '').' '.($withdrawal->reviewer->last_name ?? ''))
                    : null,
                'payout_account' => $payoutAccount ? [
                    'account_holder_name' => $payoutAccount->account_holder_name,
                    'account_type' => $payoutAccount->account_type->value,
                    'masked_number' => $maskedNumber,
                    'bank_name' => $payoutAccount->bank_name,
                    'routing_number' => $payoutAccount->routing_number,
                    'email' => $payoutAccount->email,
                ] : null,
            ],
        ]);
    }

    public function approve(Request $request, VendorWithdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== WithdrawalStatus::Pending) {
            return redirect()->route('admin.fm.withdrawals.show', $withdrawal)
                ->with('error', 'Only pending withdrawals can be approved.');
        }

        $admin = $request->user('admin');
        $withdrawal->update([
            'status' => WithdrawalStatus::Approved,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        $vendor = $withdrawal->vendor;
        if ($vendor) {
            $vendor->notify(new VendorGenericNotification(
                sender: 'Finance Team',
                message: sprintf('Your withdrawal request of %s has been approved and will be processed shortly.', number_format((float) $withdrawal->amount, 2)),
                avatarUrl: null
            ));
        }

        return redirect()->route('admin.fm.withdrawals.index', ['tab' => 'pending'])
            ->with('success', 'Withdrawal approved successfully.');
    }

    public function reject(RejectWithdrawalRequest $request, VendorWithdrawal $withdrawal): RedirectResponse
    {
        if ($withdrawal->status !== WithdrawalStatus::Pending) {
            return redirect()->route('admin.fm.withdrawals.show', $withdrawal)
                ->with('error', 'Only pending withdrawals can be rejected.');
        }

        $admin = $request->user('admin');
        $withdrawal->update([
            'status' => WithdrawalStatus::Rejected,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'rejection_reason' => $request->validated('rejection_reason'),
        ]);

        $vendor = $withdrawal->vendor;
        if ($vendor) {
            $reason = $request->validated('rejection_reason') ?: 'No reason provided.';
            $vendor->notify(new VendorGenericNotification(
                sender: 'Finance Team',
                message: sprintf('Your withdrawal request of %s was rejected. Reason: %s', number_format((float) $withdrawal->amount, 2), $reason),
                avatarUrl: null
            ));
        }

        return redirect()->route('admin.fm.withdrawals.index', ['tab' => 'pending'])
            ->with('success', 'Withdrawal rejected.');
    }

    public function markProcessing(Request $request, VendorWithdrawal $withdrawal): RedirectResponse
    {
        if (! in_array($withdrawal->status, [WithdrawalStatus::Pending, WithdrawalStatus::Approved], true)) {
            return redirect()->route('admin.fm.withdrawals.show', $withdrawal)
                ->with('error', 'Only pending or approved withdrawals can be marked as processing.');
        }

        $withdrawal->update([
            'status' => WithdrawalStatus::Processing,
            'reviewed_by' => $withdrawal->reviewed_by ?? $request->user('admin')->id,
            'reviewed_at' => $withdrawal->reviewed_at ?? now(),
        ]);

        return redirect()->route('admin.fm.withdrawals.show', $withdrawal)
            ->with('success', 'Withdrawal marked as processing.');
    }

    public function markCompleted(Request $request, VendorWithdrawal $withdrawal): RedirectResponse
    {
        if (! in_array($withdrawal->status, [WithdrawalStatus::Approved, WithdrawalStatus::Processing], true)) {
            return redirect()->route('admin.fm.withdrawals.show', $withdrawal)
                ->with('error', 'Only approved or processing withdrawals can be marked as completed.');
        }

        $withdrawal->update([
            'status' => WithdrawalStatus::Completed,
            'processed_at' => now(),
        ]);

        $vendor = $withdrawal->vendor;
        if ($vendor) {
            $vendor->notify(new VendorGenericNotification(
                sender: 'Finance Team',
                message: sprintf('Your withdrawal of %s has been completed and the funds have been sent.', number_format((float) $withdrawal->amount, 2)),
                avatarUrl: null
            ));
        }

        return redirect()->route('admin.fm.withdrawals.show', $withdrawal)
            ->with('success', 'Withdrawal marked as completed.');
    }
}

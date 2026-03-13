<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\WithdrawalStatus;
use App\Http\Controllers\Controller;
use App\Models\VendorBalance;
use App\Models\VendorEarning;
use App\Models\VendorPayoutAccount;
use App\Models\VendorWithdrawal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index(Request $request): Response
    {
        $vendor = $request->user('vendor');

        $totalEarned = VendorEarning::where('vendor_id', $vendor->id)->sum('net_amount');
        $pendingBalance = VendorEarning::where('vendor_id', $vendor->id)
            ->whereNull('released_at')
            ->sum('net_amount');
        $releasedEarned = VendorEarning::where('vendor_id', $vendor->id)
            ->whereNotNull('released_at')
            ->sum('net_amount');

        $totalWithdrawn = VendorWithdrawal::where('vendor_id', $vendor->id)
            ->whereIn('status', [
                WithdrawalStatus::Approved,
                WithdrawalStatus::Processing,
                WithdrawalStatus::Completed,
            ])
            ->sum('amount');

        $availableBalance = max(0, $releasedEarned - $totalWithdrawn);

        VendorBalance::updateOrCreate(
            ['vendor_id' => $vendor->id],
            [
                'total_earned' => $totalEarned,
                'total_withdrawn' => $totalWithdrawn,
                'pending_balance' => $pendingBalance,
                'available_balance' => $availableBalance,
            ],
        );

        $withdrawals = VendorWithdrawal::where('vendor_id', $vendor->id)
            ->latest()
            ->take(50)
            ->get()
            ->map(function (VendorWithdrawal $withdrawal) {
                return [
                    'id' => $withdrawal->id,
                    'date' => optional($withdrawal->created_at)?->format('M d, Y H:i'),
                    'amount' => (float) $withdrawal->amount,
                    'status' => $withdrawal->status->value,
                    'statusLabel' => $withdrawal->status->label(),
                ];
            })
            ->values();

        $payoutAccounts = VendorPayoutAccount::query()
            ->where('vendor_id', $vendor->id)
            ->active()
            ->orderByDesc('is_default')
            ->orderByDesc('id')
            ->get()
            ->map(function (VendorPayoutAccount $account) {
                $maskedNumber = $account->account_number
                    ? str_repeat('•', max(0, strlen($account->account_number) - 4)).substr($account->account_number, -4)
                    : null;

                return [
                    'id' => $account->id,
                    'label' => trim(
                        ($account->account_holder_name ?: 'Payout account')
                        .($maskedNumber ? " ••••{$maskedNumber}" : '')
                    ),
                    'accountType' => $account->account_type->value,
                    'isDefault' => (bool) $account->is_default,
                    'email' => $account->email,
                    'maskedNumber' => $maskedNumber,
                ];
            })
            ->values();

        return Inertia::render('vendor/payments', [
            'stats' => [
                'totalEarned' => (float) $totalEarned,
                'pendingBalance' => (float) $pendingBalance,
                'availableBalance' => (float) $availableBalance,
                'totalWithdrawn' => (float) $totalWithdrawn,
            ],
            'withdrawals' => $withdrawals,
            'payoutAccounts' => $payoutAccounts,
        ]);
    }

    public function withdraw(Request $request): RedirectResponse
    {
        $vendor = $request->user('vendor');

        $totalEarned = VendorEarning::where('vendor_id', $vendor->id)
            ->whereNotNull('released_at')
            ->sum('net_amount');

        $totalWithdrawn = VendorWithdrawal::where('vendor_id', $vendor->id)
            ->whereIn('status', [
                WithdrawalStatus::Approved,
                WithdrawalStatus::Processing,
                WithdrawalStatus::Completed,
            ])
            ->sum('amount');

        $availableBalance = max(0, $totalEarned - $totalWithdrawn);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'payout_account_id' => ['required', 'integer', 'exists:vendor_payout_accounts,id'],
            'note' => ['nullable', 'string'],
        ]);

        if ($validated['amount'] > $availableBalance) {
            return back()->withErrors([
                'amount' => 'Requested amount exceeds your available balance.',
            ]);
        }

        VendorWithdrawal::create([
            'vendor_id' => $vendor->id,
            'payout_account_id' => $validated['payout_account_id'],
            'amount' => $validated['amount'],
            'note' => $validated['note'] ?? null,
            'status' => WithdrawalStatus::Pending,
        ]);

        return redirect()
            ->route('vendor.payments')
            ->with('success', 'Withdrawal request submitted successfully.');
    }
}

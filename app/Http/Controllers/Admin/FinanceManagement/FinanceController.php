<?php

namespace App\Http\Controllers\Admin\FinanceManagement;

use App\Enums\WithdrawalStatus;
use App\Http\Controllers\Controller;
use App\Models\VendorBalance;
use App\Models\VendorWithdrawal;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function index(): Response
    {
        $totalAvailableBalance = (float) VendorBalance::query()->sum('available_balance');
        $totalPendingWithdrawalAmount = (float) VendorWithdrawal::query()
            ->where('status', WithdrawalStatus::Pending)
            ->sum('amount');
        $pendingWithdrawalCount = VendorWithdrawal::query()
            ->where('status', WithdrawalStatus::Pending)
            ->count();
        $completedThisMonth = (float) VendorWithdrawal::query()
            ->where('status', WithdrawalStatus::Completed)
            ->whereMonth('processed_at', now()->month)
            ->whereYear('processed_at', now()->year)
            ->sum('amount');

        return Inertia::render('admin/finance-management/finance', [
            'stats' => [
                'totalAvailableBalance' => $totalAvailableBalance,
                'totalPendingWithdrawalAmount' => $totalPendingWithdrawalAmount,
                'pendingWithdrawalCount' => $pendingWithdrawalCount,
                'completedThisMonth' => $completedThisMonth,
            ],
        ]);
    }
}

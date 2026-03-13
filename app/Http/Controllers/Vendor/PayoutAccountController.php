<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\AccountTypeMethod;
use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Models\VendorPayoutAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;

class PayoutAccountController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $vendor = $request->user('vendor');

        abort_unless($vendor, 403);

        $validator = Validator::make($request->all(), [
            'account_type' => ['required', new Enum(AccountTypeMethod::class)],
            'account_holder_name' => ['required', 'string', 'max:255'],
            'account_number' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'routing_number' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'card_expiry_month' => ['nullable', 'string', 'size:2'],
            'card_expiry_year' => ['nullable', 'string', 'size:4'],
            'security_code' => ['nullable', 'digits_between:3,4'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $validator->sometimes('account_number', 'required', function ($input) {
            return $input->account_type === AccountTypeMethod::CARD->value;
        });
        $validator->sometimes('card_expiry_month', 'required', function ($input) {
            return $input->account_type === AccountTypeMethod::CARD->value;
        });
        $validator->sometimes('card_expiry_year', 'required', function ($input) {
            return $input->account_type === AccountTypeMethod::CARD->value;
        });
        $validator->sometimes('security_code', 'required', function ($input) {
            return $input->account_type === AccountTypeMethod::CARD->value;
        });
        $validator->sometimes('email', 'required', function ($input) {
            return in_array($input->account_type, [
                AccountTypeMethod::PAYPAL->value,
                AccountTypeMethod::STRIPE->value,
            ], true);
        });

        $validated = $validator->validate();

        $isFirstAccount = ! VendorPayoutAccount::where('vendor_id', $vendor->id)->exists();
        $shouldBeDefault = $isFirstAccount || $request->boolean('is_default');

        if ($shouldBeDefault) {
            VendorPayoutAccount::where('vendor_id', $vendor->id)->update(['is_default' => false]);
        }

        VendorPayoutAccount::create([
            'vendor_id' => $vendor->id,
            'account_type' => $validated['account_type'],
            'account_holder_name' => $validated['account_holder_name'],
            'account_number' => $validated['account_number'] ?? null,
            'bank_name' => $validated['bank_name'] ?? null,
            'routing_number' => $validated['routing_number'] ?? null,
            'email' => $validated['email'] ?? null,
            'card_expiry_month' => $validated['card_expiry_month'] ?? null,
            'card_expiry_year' => $validated['card_expiry_year'] ?? null,
            'security_code' => $validated['security_code'] ?? null,
            'is_default' => $shouldBeDefault,
            'status' => ActiveInactiveStatus::ACTIVE->value,
        ]);

        return redirect()
            ->route('vendor.payments')
            ->with('success', 'Payout account added successfully.');
    }
}

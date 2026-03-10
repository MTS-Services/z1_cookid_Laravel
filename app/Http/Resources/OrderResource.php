<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Order $this */
        return [
            // Internal database ID (useful for API calls/updates)
            'reference' => (string) $this->id,

            // Public-facing Order Number (e.g., ORD-12345)
            'id' => $this->order_number,

            // Relationship data with null-safety
            'customerName' => $this->user->name ?? 'Guest User',
            'service' => $this->service->title ?? 'Service Deleted',

            // Status handling (extracting value from Enum)
            'status' => $this->status->value,

            // Formatted financial data
            'amount' => (float) $this->total,
            'formatted_amount' => number_format($this->total, 2),

            // Date formatting
            'date' => $this->created_at?->format('m/d/Y'),
            'iso_date' => $this->created_at?->toIso8601String(),

            // Conditional data: Only show cancel reason if it's cancelled
            'cancel_reason' => $this->when($this->status->value === 'cancelled', $this->cancel_reason),

            // Metadata for specific UI logic (optional but helpful)
            'can_be_cancelled' => in_array($this->status->value, ['pending', 'confirmed']),
        ];
    }
}

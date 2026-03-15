<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commission extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'commission_type',
        'commission_value',
        'status',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'commission_type' => CommissionType::class,
            'commission_value' => 'decimal:2',
            'status' => ActiveInactiveStatus::class,
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * Resolve the active commission rule for a category. Prefers category-specific over global.
     */
    public static function resolveForCategory(?int $categoryId): ?self
    {
        return self::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->where(function (Builder $q) use ($categoryId) {
                if ($categoryId !== null) {
                    $q->where('category_id', $categoryId)->orWhereNull('category_id');
                } else {
                    $q->whereNull('category_id');
                }
            })
            ->orderByRaw('category_id IS NOT NULL DESC')
            ->first();
    }

    /**
     * Compute commission amount from gross amount using this rule.
     */
    public function computeAmount(float $grossAmount): float
    {
        return match ($this->commission_type) {
            CommissionType::Percentage => round($grossAmount * ((float) $this->commission_value / 100), 2),
            CommissionType::Fixed => (float) $this->commission_value,
        };
    }
}

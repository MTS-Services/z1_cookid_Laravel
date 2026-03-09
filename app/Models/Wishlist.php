<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Wishlist extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'sort_order',
        'user_id',
        'service_id',
    ];
    
    /*****************************************
    * Relationships
    *****************************************/
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

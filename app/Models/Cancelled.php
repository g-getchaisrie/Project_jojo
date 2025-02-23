<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cancelled extends Model
{
    protected $table = 'cancelleds';
    protected $fillable = ['reservation_id', 'reason', 'cancelled_at'];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cancelled;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'table_id',
        'reservation_time',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class, 'table_id');
    }

    public function cancel($reason = null)
    {
        Cancelled::create([
            'reservation_id' => $this->id,
            'reason' => $reason,
            'cancelled_at' => now(),
        ]);

        $this->delete();
    }
}

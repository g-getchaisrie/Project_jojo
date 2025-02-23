<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tables extends Model
{
    use HasFactory;

    protected $fillable = [
        'available',
        'reserved_by_user_id',
        'seat',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservations::class, 'table_id');
    }
}

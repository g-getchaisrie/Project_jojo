<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->cancel(request('reason'));

        return redirect()->route('reserve.index')->with('success', 'Reservation cancelled successfully.');
    }
}

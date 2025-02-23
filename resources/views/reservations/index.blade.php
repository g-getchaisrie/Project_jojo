<form action="{{ route('reservations.destroy', $reservation->id) }}" method="POST">
    @csrf
    @method('DELETE')
    <button type="submit">Cancel Reservation</button>
</form>

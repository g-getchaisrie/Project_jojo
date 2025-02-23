<form method="POST" action="/reserve/1">
    @csrf
    @method('PUT')
    <!-- ...existing form fields... -->
    <button type="submit">Submit</button>
</form>

<form method="POST" action="/shabu/cancel/1">
    @csrf
    @method('DELETE')
    <button type="submit">Cancel Reservation</button>
</form>

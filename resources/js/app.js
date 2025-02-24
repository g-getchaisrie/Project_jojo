$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

// Function to update reservation
function updateReservation(id) {
    $.ajax({
        url: `/reserve/${id}`,
        type: 'PUT',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.error(error);
        }
    });
}

// Function to cancel reservation
function cancelReservation(id) {
    $.ajax({
        url: `/shabu/cancel/${id}`,
        type: 'DELETE',
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.error(error);
        }
    });
}

// Example usage
// updateReservation(1);
// cancelReservation(1);

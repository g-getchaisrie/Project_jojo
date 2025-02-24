const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Session lifetime in milliseconds
}));
app.use(csrf({ cookie: true }));

// Define the route for /shabu/reserve/:id
app.put('/shabu/reserve/:id', (req, res) => {
    const id = req.params.id;
    // Logic to handle the request, e.g., updating reservation details
    // For example:
    res.send(`Reservation details for ID: ${id} have been updated`);
});

// Define the route for canceling a reservation
app.delete('/shabu/cancel/:id', (req, res) => {
    const id = req.params.id;
    // Logic to move reservation data to the cancel table
    // For example:
    // db.query('INSERT INTO cancel SELECT * FROM reservations WHERE id = ?', [id], (err, result) => {
    //     if (err) throw err;
    //     db.query('DELETE FROM reservations WHERE id = ?', [id], (err, result) => {
    //         if (err) throw err;
    //         res.send('Reservation canceled');
    //     });
    // });
    res.send(`Reservation with ID: ${id} has been canceled`);
});

// Define the route for fetching table data
app.get('/shabu/table/:id', (req, res) => {
    const id = req.params.id;
    // Logic to fetch table data from the database
    // For example:
    // db.query('SELECT * FROM tables WHERE id = ?', [id], (err, result) => {
    //     if (err) throw err;
    //     if (result.length > 0) {
    //         res.json(result[0]);
    //     } else {
    //         res.status(404).send('Table not found');
    //     }
    // });
    res.json({ id: id, seat: 4 }); // Example response
});

app.get('/form', (req, res) => {
    res.send(`
        <form action="/process" method="POST">
            <input type="hidden" name="_csrf" value="${req.csrfToken()}">
            <!-- ...existing form fields... -->
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post('/process', (req, res) => {
    // Handle form submission
    res.send('Form processed');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

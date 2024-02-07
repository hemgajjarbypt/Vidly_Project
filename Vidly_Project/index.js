const winston = require('winston');
require('express-async-errors');
const error = require('./middleware/error');
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const app = express();

// winston.add(winston.transports.File, { filename: 'logfile.log' })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use(error);

mongoose.connect('mongodb://localhost/vidly_project')
    .then(() => console.log('Connected to database Successfully...'))
    .catch((err) => console.log('Error While Connecting to Database!', err));

app.listen(3000, () => {
    console.log('Listing at port 3000');
});
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

mongoose.connect('mongodb://localhost/vidly_project')
    .then(() => console.log('Connected to database Successfully...'))
    .catch((err) => console.log('Error While Connecting to Database!', err));

app.listen(3000, () => {
    console.log('Listing at port 3000');
});
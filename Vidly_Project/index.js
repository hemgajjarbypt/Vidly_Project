const express = require('express');
const genres = require('./routes/genres');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);

app.listen(3000, () => {
    console.log('Listing at port 3000');
});
const { genreSchema } = require('./genre');
const Joi = require('joi');
const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        min: 3,
        max: 50,
        required: true
    },
    genre: {
        type: genreSchema,
        select: false
    },
    numberInStock: {
        type: Number,
        default: 0,
        required: true,
        min: 0,
        max: 100
    },
    dailyRentalRate: {
        required: true,
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        genre: Joi.object().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
}


module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;

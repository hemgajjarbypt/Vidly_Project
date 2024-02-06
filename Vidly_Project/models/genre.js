const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    genreName: {
        type: String,
        required: true,
        min: 5,
        max: 20,
        enum: ['Action', 'Horror', 'Comedy', 'Biography', 'Documentary', 'Suspense', 'Thriller', 'Adventure', 'Drama'],
    },
    date: { type: Date },
    movieCount: Number,
    isAvailable: Boolean
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        genreName: Joi.string().min(5).required(),
        date: Joi.date(),
        movieCount: Joi.number().required().min(1),
        isAvailable: Joi.boolean().required()
    })
    return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateGenre = validateGenre;
const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    genreName: {
        type: String,
        required: true,
        enum: ['Action', 'Horror', 'Comedy', 'Biography', 'Documentary', 'Suspense', 'Thriller', 'Adventure', 'Drama'],
    },
    movieCount: {
        type: Number,
    },
    isAvailable: {
        type: Boolean,
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        genreName: Joi.string().required(),
        movieCount: Joi.number().min(0),
        isAvailable: Joi.boolean()
    })
    return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateGenre = validateGenre;
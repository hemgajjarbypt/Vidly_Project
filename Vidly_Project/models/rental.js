const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');
const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema({
    customer: {
        type: customerSchema
    },
    movie: {
        type: movieSchema
    },
    rentalFee: {
        type: Number,
        min: 0
    },
    dateOut: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dateReturned: {
        type: Date
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customer: Joi.object().required(),
        movie: Joi.object().required(),
        rentalFee: Joi.number().min(0),
        dateOut: Joi.date().required(),
        dateReturned: Joi.date()
    });
    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;

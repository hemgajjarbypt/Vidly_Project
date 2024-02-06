const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 20,
        required: true
    },
    phone: {
        type: String,
        min: 10,
        max: 10,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = new mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        phone: Joi.string().min(10).max(10).required(),
        isGold: Joi.boolean()
    })
    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
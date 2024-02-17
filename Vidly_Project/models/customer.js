const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 20,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        max: 50,
        index: true,
        validate: {
            validator: function(value) {
                // Regular expression for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
              },
              message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        min: 10,
        max: 10,
        required: true,
        unique: true,
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
        email: Joi.string().unique().required().max(50).email(),
        phone: Joi.string().min(10).max(10).required(),
        isGold: Joi.boolean()
    })
    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
module.exports.customerSchema = customerSchema;
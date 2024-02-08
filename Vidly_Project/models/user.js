const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, 'jwtPrivateKey');
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
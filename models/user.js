const mongoose = require('mongoose');
const Joi = require('joi');

const Schema = mongoose.Schema;

const user_schema = new Schema({
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    orders: [{
        ship_from: {type: String, required: true},
        ship_to: {type: String, required: true},
        cost: {type: Number, required: true},
        delivery_type: {type: String, require: true},
        order_timestamp: {type: Date, default: Date.now},
        complete_timestamp: {type: Date},
    }]
})
 

const User = mongoose.model('user', user_schema);


let validate_schema = Joi.object({
    fname: Joi.string()
        .alphanum()
        .max(30)
        .required(),

    lname: Joi.string()
        .alphanum()
        .max(64)
        .required(),

    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),

    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
})

const validate_user = (input) => {
    return validate_schema.validate(input);
}


exports.User = User;
exports.validate = validate_user;
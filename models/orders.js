const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const location_schema = Schema({
    address: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
});

const order_schema = Schema({
    ship_from: {type: location_schema, required: true},
    ship_to: {type: location_schema, required: true},
    cost: {type: Number, required: true},
    delivery_type: {type: String, require: true},
    order_timestamp: {type: Date, default: Date.now},
    complete_timestamp: {type: Date},
})

const Visitor_Order = mongoose.model('visitor_order', order_schema);

exports.order_schema = order_schema;
exports.Visitor_Order = Visitor_Order;
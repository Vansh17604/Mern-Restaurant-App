const mongoose = require('mongoose');
const Table = require('./table');
const { Schema } = mongoose;
const orderSchema = new Schema({
    categoryid:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategoryid:{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    dishid:{
        type: Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
    },
    tableid:{
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    orderstatus:{
        type: String,
        required: true
    },
    orderdate:{
        type: Date,
        default: Date.now
    },
    quantity:{
        type: Number,
        required: true
    },
    waiterid:{
        type: Schema.Types.ObjectId,
        ref: 'Waiter',
        required: true
    }
},{timestamps:true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
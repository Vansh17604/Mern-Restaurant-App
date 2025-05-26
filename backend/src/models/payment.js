const mongoose = require('mongoose');
const { Schema } = mongoose;
const paymentSchema = new Schema({
    orderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    customername: {
        type: String,
        required: true
    },
    customeremail: {
        type: String,
        required: true
    },
    customerphone: {
        type: String,
        required: true
    },
    paymentmethod: {
        type: String,
        required: true
    },
    paymentstatus: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
}
);
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
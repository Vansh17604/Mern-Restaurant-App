const mongoose = require('mongoose');
const { Schema } = mongoose;
const tableSchema = new Schema({
    tablenumber: {
        type: String,
        required: true
    },
    tablestatus: {
        type: String,
        required: true
    },
    tablecapacity: {
        type: Number,
        required: true
    },
    waiter_id:{
        type: Schema.Types.ObjectId,
        ref: 'Waiter',
        default:null
    }

},
{ timestamps: true }
);
const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
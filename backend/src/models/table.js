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

},
{ timestamps: true }
);
const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const subcategorySchema = new Schema({
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategoryname: {
                en: {
            type: String,
            required: true
        },
        es: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Deactive'],
        default: 'Active'
    },

},
{
    timestamps: true
}
);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;
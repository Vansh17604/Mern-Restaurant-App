const mongoose = require('mongoose');
const { Schema } = mongoose;
const categorySchema = new Schema({
   categoryName: {
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
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
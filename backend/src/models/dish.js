const mongoose = require('mongoose');
const { Schema } = mongoose;
const dishSchema = new Schema({
    dishName: {
        en: {
    type: String,
    required: true
  },
  es: {
    type: String,
    required: true
  }
    },
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    price: {
        type: Number,
        required: true
    },currency: {
        type: String,
        default: 'USD'
    },
    description: {
       en: {
    type: String,
    required: true
  },
  es: {
    type: String,
    required: true
  }
    },
    imageUrl: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;
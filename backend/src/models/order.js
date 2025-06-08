const mongoose = require('mongoose');
const { Schema } = mongoose;
const orderSchema = new Schema({
 dishes: [
  {
    dish_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Dish', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    status:{
      type:String,
      required:true
    }
  }
],
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
  
    waiterid:{
        type: Schema.Types.ObjectId,
        ref: 'Waiter',
        required: true
    },
   kitchenid: {
  type: Schema.Types.ObjectId,
  ref: "Kitchen"
}
},{timestamps:true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
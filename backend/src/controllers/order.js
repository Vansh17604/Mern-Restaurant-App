const Order= require("../models/order");
const mongoose= require('mongoose');

const {check,validationResult}= require('express-validator');


module.exports.CreateOrder = [
  // Validation rules
  check('dishes').isArray({ min: 1 }).withMessage('Dishes are required'),
  check('dishes.*.dish_id').isMongoId().withMessage('Invalid Dish ID'),
  check('dishes.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  check('tableid').isMongoId().withMessage('Invalid table ID'),
  check('orderstatus').notEmpty().withMessage('Order status is required'),
  check('waiterid').isMongoId().withMessage('Invalid waiter ID'),
    check('dishes.*.status')
    .notEmpty().withMessage('Dish status is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = new Order(req.body);
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (err) {
   
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
];



  module.exports.DeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports.EditOrder = [
  check('dishes')
    .isArray({ min: 1 })
    .withMessage('Dishes are required'),

  check('dishes.*.dish_id')
    .isMongoId()
    .withMessage('Invalid Dish ID'),

  check('dishes.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
 

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      
      order.dishes = req.body.dishes;
      await order.save();

      res.status(200).json({ message: 'Dishes updated', order });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
];



module.exports.FetchOrderByWaiterId = async (req, res) => {
  try {
    const waiterId = req.params.id;

    if (!waiterId || !mongoose.Types.ObjectId.isValid(waiterId)) {
      return res.status(400).json({ error: 'Invalid or missing waiter ID' });
    }
    const orders = await Order.find({ 
      waiterid: waiterId, 
      orderstatus: { $ne: 'served' } 
    }).populate("dishes.dish_id");

    return res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
};



  module.exports.FetchOrderbyOrderId = async(req,res)=>{
    try{
      const orderId=req.params.id;
      const order=await Order.findById(orderId);
      if(!order) return res.status(404).json({error:'Order not found'});
      res.status(200).json(order);
      }catch(err){
       
        res.status(500).json({
          error:'Internal server error',
          details:err.message,
          });
          }
  }
  module.exports.FetchallTheOrder = async (req, res) => {
  try {
    const orders = await Order.find({ orderstatus: { $ne: "served" } })
                              .populate("dishes.dish_id");

    return res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
};


module.exports.AssignKitchen = async (req, res) => {
  try {
    const { orderId, kitchenId, dishId } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid or missing order ID" });
    }

    if (!kitchenId || !mongoose.Types.ObjectId.isValid(kitchenId)) {
      return res.status(400).json({ error: "Invalid or missing kitchen ID" });
    }

    if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ error: "Invalid or missing dish ID" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, "dishes._id": dishId },
      { $set: { "dishes.$.status": "prepare" } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order or dish not found" });
    }
      order.orderstatus==="prepare",
      order.kitchenid = kitchenId;
  
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("dishes.dish_id tableid waiterid kitchenid");

    res.status(200).json(populatedOrder);
  } catch (err) {
    console.error("Error assigning kitchen:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

module.exports.MarkDishPrepared = async (req, res) => {
  try {
    const { orderId, dishId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(orderId) ||
        !mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ error: "Invalid orderId or dishId" });
    }
    const orderAfterDish = await Order.findOneAndUpdate(
      { _id: orderId, "dishes._id": dishId },
      { $set: { "dishes.$.status": "prepared" } },
      { new: true }
    ).populate("dishes.dish_id tableid waiterid kitchenid");
    if (!orderAfterDish) {
      return res.status(404).json({ error: "Order or dish not found" });
    }

    
    const allReady = orderAfterDish.dishes.every(d => d.status === "prepared");
    if (allReady && orderAfterDish.orderstatus !== "prepared") {
      orderAfterDish.orderstatus = "prepared";
      await orderAfterDish.save();
    }

    const finalOrder = await Order.findById(orderId)
      .populate("dishes.dish_id tableid waiterid kitchenid");
    res.json(finalOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

module.exports.MarkAsServed = async(req,res)=>{
  try {
    const { orderId } = req.body;
    // Validate order ID
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid or missing order ID" });
      }
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderstatus: "served" },
        { new: true }
        ).populate("dishes.dish_id tableid waiterid kitchenid");
        if (!updatedOrder) {
          return res.status(404).json({ error: "Order not found" });
          }
          res.status(200).json(updatedOrder);
          } catch (err) {
            console.error("Error updating order status:", err);
            res.status(500).json({
              error: "Internal server error",
              details: err.message,
              });
              }
}
  module.exports.FetchOrderbyWaiterIdandTableId= async(req,res)=>{
    try{
      const waiterId=req.params.id;
      const tableId=req.params.tableId;
      const order=await Order.find({waiterid:waiterId,tableid:tableId,orderstatus:"order"}).populate("dishes.dish_id");
        if(order.length===0) return res.status(404).json({error:'No orders found'});
        res.status(200).json(order);
        }catch(err){
          console.error('Error fetching orders:', err);
          res.status(500).json({
            error: 'Internal server error',
            details: err.message,
            });
            }
  }

  module.exports.FetchAllOrderForAdmin = async(req,res)=>{
    try{
      const orders=await Order.find().populate("dishes.dish_id waiterid kitchenid tableid");
    
      res.status(200).json(orders);
    }catch(err){
      console.error('Error fetching orders:', err);
      res.status(500).json({
        error: 'Internal server error',
        details: err.message,
        });
    }
        
  } 
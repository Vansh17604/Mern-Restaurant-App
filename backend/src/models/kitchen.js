const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const kitchenSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender:{
        type:String,
        required:true
    },
      dob:{
        type: Date,
        required: true
    },
    city:{
        type: String,
        required: true
    },
     attendance:[
        {
            date: {
                type: Date,
                required: true
            },
            status:{
                type: String,
                enum: ['Present', 'Absent'],
                required: true
                }
        }
    ],
    perdaySalery:{
        type: Number,
        required: true

    },
    Salery:[
        {
            month: {
                type: String,
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    token:{
        type: String,
    },
    status:{
        type: String,
        required: true,
    },

   order: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
]

    
   

},{
    timestamps: true
})

kitchenSchema.pre('save', async function(next) {
  const kitchen = this;
  if (kitchen.isModified('password')) {
    kitchen.password = await bcrypt.hash(kitchen.password, 10);
  }
  next();
});

const Kitchen = mongoose.model('Kitchen', kitchenSchema);
module.exports = Kitchen; 
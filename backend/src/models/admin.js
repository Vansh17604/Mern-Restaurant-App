const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const adminSchema = new Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
},
{
    timestamps: true
});

adminSchema.pre('save', async function(next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
  next();
});



const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
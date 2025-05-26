const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { Schema } = mongoose;
const waiterSchema = new Schema({
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
        en:{
            type: String,
            required: true
        },
        es:{
            type: String,
            required: true
        }

    },
    address:{
      en:{
        type: String,
        required: true
      },
        es:{
            type: String,
            required: true
        }
    },
    phone:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    city:{
      en:{
        type: String,
        required: true
      },
        es:{
            type: String,
            required: true
        }
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
                },
                overtime:[
                    {
                        start: {
                            type: Date,
                            required: true
                        },
                        end: {
                            type: Date,
                            required: true
                        },
                        hours: {
                            type: Number,
                            required: true
                        }
                    }
                ]
        }
    ],
    perdaySalery:{
        type: Number,
        required: true

    },
    otperHourSalery:{
        type: Number,
        required: true
    },photo:{
        type: String,
        required: true
    },
    leave:[
        {
            date:{
                type: Date,
                required: true
            },
            reason:{
                type: String,
                required: true
            },
            status:{
                type: String,
                enum: ['Approved', 'Pending', 'Rejected'],
                default: 'Pending'
            }
        }
    ],
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
    }

},
{
    timestamps: true
}
);

waiterSchema.pre('save', async function(next) {
  const waiter = this;
  if (waiter.isModified('password')) {
    waiter.password = await bcrypt.hash(waiter.password, 10);
  }
  next();
});



const Waiter = mongoose.model('Waiter', waiterSchema);
module.exports = Waiter;
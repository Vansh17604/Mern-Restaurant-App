const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookingSchema = new Schema(
  {
    customername: {
      type: String,
      required: true,
    },
    customeremail: {
      type: String,
      required: true,
    },
    customerphone: {
      type: String,
      required: true,
    },
    bookingdate: {
      type: Date,
      required: true,
    },
    bookingtime: {
      type: String,
      required: true,
    },
    tableid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

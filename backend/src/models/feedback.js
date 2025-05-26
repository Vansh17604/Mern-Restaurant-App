const mongoose = require('mongoose');
const { Schema } = mongoose;
const feedbackSchema = new Schema({
    CustomerName: {
        type: String,
        required: true
    },
    CustomerEmail: {
        type: String,
        required: true
    },
    Feedback: {
        type: String,
        required: true
    },
    Rating: {
        type: Number,
        required: true
    },

},
{
    timestamps: true
}
);
const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    name: {
        type: String,
    },
    emailOtp: {
        type: String
    },
    phoneOtp: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);

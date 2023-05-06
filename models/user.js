const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        required: true,
    },
    enrolledDate: {
        type: Date,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

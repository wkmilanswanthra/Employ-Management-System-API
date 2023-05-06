const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    leaveReason: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'Pending'
    }
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;

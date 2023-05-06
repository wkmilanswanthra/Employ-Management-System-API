const mongoose = require('mongoose');

const date = new Date();

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: date.toISOString().split('T')[0],
    },
    employeeIds: {
        type: [String],
        required: true
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
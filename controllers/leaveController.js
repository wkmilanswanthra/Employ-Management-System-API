const Leave = require('../models/leave');


const leaveController = {
    addLeave: async (req, res) => {
        try {
            const leave = new Leave({
                userId: req.body.userId,
                name: req.body.name,
                leaveType: req.body.leaveType,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                leaveReason: req.body.leaveReason
            });
            await leave.save();
            res.status(201).json({message: 'Leave added'});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: err.code});
        }
    },


    getAllLeave: async(req,res) =>{
        try{
            const respoonse = await Leave.find();
            res.status(200).send(respoonse);
        }
        catch (e) {
            res.status(500).send(e);
        }
    },


    updateLeave: async (req, res) => {
        const leaveId = req.params.id;
        const updates = req.body;

        try {
            const leave = await Leave.findByIdAndUpdate(leaveId, updates, {
                new: true,
                runValidators: true,
            });
            if (!leave) {
                return res.status(404).send('Leave not found');
            }
            res.send(leave);
        } catch (error) {
            console.error(error);
            res.status(500).send({error: error.code});
        }
    },
}

module.exports = leaveController
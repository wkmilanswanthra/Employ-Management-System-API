const  express  = require("express");
const  { addLeave, getAllLeave, updateLeave } = require("../controllers/leaveController.js");

const router = express.Router();

router.post('/add-leave', addLeave);
router.get('/get', getAllLeave);
router.patch('/update/:id', updateLeave);

module.exports =  router;
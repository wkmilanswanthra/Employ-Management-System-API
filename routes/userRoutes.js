const express = require("express");
const { userController } = require("../controllers/userController.js");
const authorize = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", authorize("admin"), userController.register);
router.post("/login", userController.login);
router.post("/mark-attendance", userController.markAttendance);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", authorize("admin"), userController.deleteUser);
router.get("/", authorize("admin"), userController.getUsers);
router.get("/report/get", authorize("admin"), userController.generateReport);

module.exports = router;

const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Attendance = require("../models/attendance.js");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { log } = require("console");

const userController = {
  login: async (req, res) => {
    try {
      const { employeeId, password } = req.body;
      const user = await User.findOne({ employeeId: employeeId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        {
          employeeId: user.employeeId,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        token: token,
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          age: user.age,
          gender: user.gender,
          role: user.role,
          contactNumber: user.contactNumber,
          address: user.address,
          qualifications: user.qualifications,
          img: user.img,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  register: async (req, res) => {
    try {
      const {
        employeeId,
        password,
        name,
        age,
        gender,
        role,
        enrolledDate,
        contactNumber,
        address,
        qualifications,
      } = req.body;
      const existingUser = await User.findOne({ employeeId });

      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        employeeId,
        password: hashedPassword,
        name,
        age,
        gender,
        role,
        enrolledDate,
        contactNumber,
        address,
        qualifications,
        img: `https://robohash.org/${employeeId}?set=set1&bgset=bg2&size=200x200`,
      });
      await newUser.save();

      return res.status(201).json({ message: "User created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.code });
    }
  },

  getUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send({
        user: {
          employeeId: user.employeeId,
          name: user.name,
          age: user.age,
          gender: user.gender,
          role: user.role,
          contactNumber: user.contactNumber,
          address: user.address,
          qualifications: user.qualifications,
          img: user.img,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      updates.password = hashedPassword;
    }

    try {
      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.code });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },

  markAttendance: async (req, res) => {
    try {
      const { employeeId } = req.body;
      let date = new Date().toISOString();
      date = date.split("T")[0];

      const attendance = await Attendance.findOneAndUpdate(
        { date: date },
        { $addToSet: { employeeIds: employeeId } },
        { upsert: true, new: true }
      );

      res.status(200).json({ success: true, attendance });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: e });
    }
  },

  generateReport: async (req, res) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const users = await User.find();
      let x = 0;

      doc.page.width = 595.28;
      doc.page.height = 841.89;

      doc.title = "Employee Report";
      doc.font("Helvetica-Bold");

      doc.fontSize(24).text("Employee report", { align: "center" });
      doc.moveDown(2);

      users.map((user) => {
        if (x && x % 4 === 0) {
          doc.addPage();
        }

        doc.roundedRect(
          2,
          2,
          doc.page.width - 2 * 2,
          doc.page.height - 2 * 2,
          20
        );
        doc.lineWidth(2).stroke();
        doc
          .fontSize(12)
          .text("Employee ID: " + user.employeeId, { align: "left" });
        doc.fontSize(12).text("Name: " + user.name, { align: "left" });
        doc.fontSize(12).text("Age: " + user.age, { align: "left" });
        doc.fontSize(12).text("Gender: " + user.gender, { align: "left" });
        doc.fontSize(12).text("Role: " + user.role, { align: "left" });
        doc
          .fontSize(12)
          .text(
            "Enrolled Date: " + user.enrolledDate.toISOString().split("T")[0],
            { align: "left" }
          );
        doc
          .fontSize(12)
          .text("Contact number: " + user.contactNumber, { align: "left" });
        doc.fontSize(12).text("Address: " + user.address, { align: "left" });
        doc
          .fontSize(12)
          .text("Qualifications: " + user.qualifications, { align: "left" });
        doc.moveDown(1);
        x++;
      });

      const fileStream = fs.createWriteStream("Employee Report.pdf");
      doc.pipe(fileStream);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Employee Report.pdf"'
      );

      doc.pipe(res);

      doc.end();
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: e });
    }
  },
};

module.exports = { userController };

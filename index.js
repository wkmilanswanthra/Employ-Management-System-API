const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const cors = require('cors');
const connectDB = require("./config/db.js");


dotenv.config({path: "./config/.env"});

const port = process.env.PORT || 3000;

const app = express();

connectDB();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "*");
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Query: ${JSON.stringify(req.query)}`);
    next();
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/leave", require("./routes/leaveRoutes"));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});





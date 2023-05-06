const mongoose = require('mongoose').default;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URI,
        )

        console.log(`MongoDB connection: ${connection.connection.host}`)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

module.exports = connectDB
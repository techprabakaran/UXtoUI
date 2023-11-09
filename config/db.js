const mongoose = require('mongoose');

const connectDB = async() => {
    return new Promise(async(resolve, reject) => {
        try {
            const url = process.env.MONGODB_URI;
            await mongoose.connect(url, { useNewUrlParser: true });
            console.log('DB connected');
            resolve(true)
        } catch (error) {
            console.log("Unable to connect DB")
            console.log(error)
            resolve(false)
        }
    })
}

module.exports = connectDB;
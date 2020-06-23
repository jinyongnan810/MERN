const mongoose = require('mongoose')
const config = require('config')
const uri = config.get('mongoURI')

const connectDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('mongo db connected..');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB

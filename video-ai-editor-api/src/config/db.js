// config/db.js
const mongoose = require('mongoose');
const logger = require('../logger')('db');

mongoose.set('strictQuery', true);

const clientOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: '1', strict: true, deprecationErrors: true } 
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI_PRODUCTS, clientOptions);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Detiene la aplicación si no se puede conectar
    }
};

module.exports = connectDB;


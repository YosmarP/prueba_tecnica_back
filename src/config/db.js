// Configuración de la conexión a MongoDB

const mongoose = require('mongoose');
require('dotenv').config();  

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);  // Salir del proceso en caso de error
    }
};

module.exports = connectDB;
// Configuración del servidor Express
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const newsRoutes = require('./routes/newsRoutes');
const setupSwagger = require('../swagger');
const seedDatabase = require('./scripts/seedDatabase'); 

require('dotenv').config();  

const app = express();
// Middlewares
app.use(cors());   //para habilitar CORS 
app.use(express.json());  // Permite que el servidor reciba JSON

// Rutas
app.use('/api', newsRoutes);  // Prefijo /api para todas las rutas de noticias

// Iniciar servidor
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB().then(() => {
    console.log('Conectado a la base de datos.');
    // Cargar datos en la base de datos al iniciar
    seedDatabase();

    // Iniciar el servidor después de la conexión
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
})
.catch(error => {
    console.error('Error de conexión a la base de datos:', error);
});

// Configurar Swagger
setupSwagger(app);
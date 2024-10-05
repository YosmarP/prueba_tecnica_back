const fs = require('fs');
const News = require('../models/newsModel'); // Ajusta la ruta según tu modelo

const seedDatabase = async () => {
    try {
        // Verificar si ya hay datos en la colección
        const count = await News.countDocuments();
        if (count > 0) {
            console.log('La base de datos ya tiene datos. No se realizarán inserciones.');
            return;
        }

        // Leer el archivo JSON
        const newsData = JSON.parse(fs.readFileSync('./src/data/news_data.json', 'utf-8'));

        // Insertar los datos en la base de datos
        await News.insertMany(newsData);
        console.log('Datos cargados exitosamente en la base de datos.');
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
};

module.exports = seedDatabase;
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const News = require('../../src/models/newsModel');

describe('News Model Test', () => {
    let mongoServer;

    beforeAll(async () => {
        // Iniciar MongoDB en memoria
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        // Conectar a MongoDB en memoria
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.connection.close(); 
        await mongoServer.stop(); 
    });

    it('Debe crear una noticia correctamente', async () => {
        const newsData = {
            title: 'Test Title',
            description: 'Test Description',
            content: 'Test Content',
            author: 'Test Author',
        };

        const news = new News(newsData);
        const savedNews = await news.save();

        // Verificar que los campos se guardan correctamente
        expect(savedNews._id).toBeDefined();
        expect(savedNews.title).toBe(newsData.title);
        expect(savedNews.description).toBe(newsData.description);
        expect(savedNews.content).toBe(newsData.content);
        expect(savedNews.author).toBe(newsData.author);
    });

    it('Debe fallar si falta un campo requerido', async () => {
        const newsWithoutTitle = new News({
            description: 'Test Description',
            content: 'Test Content',
            author: 'Test Author',
        });

        let error;
        try {
            await newsWithoutTitle.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();  // Esperamos que se produzca un error
        expect(error.errors.title).toBeDefined(); // El error debe estar relacionado con el campo title
    });
});
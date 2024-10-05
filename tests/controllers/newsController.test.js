const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const newsRoutes = require('../../src/routes/newsRoutes');
const News = require('../../src/models/newsModel');

const app = express();
app.use(express.json());
app.use('/api', newsRoutes); 

describe('News Controller Test', () => {
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

    beforeEach(async () => {
        await News.deleteMany({});
    });

    // Verificación de la Lógica de Negocio:
    it('Debe obtener todas las noticias no archivadas', async () => {
        const news = new News({
            title: 'Noticia 1',
            description: 'Descripción 1',
            content: 'Contenido 1',
            author: 'Autor 1',
        });
        await news.save();

        const res = await request(app).get('/api/news');
        expect(res.statusCode).toEqual(200);
        expect(res.body.news.length).toBe(1);
        expect(res.body.news[0].title).toBe('Noticia 1');
    });

    it('Debe agregar una nueva noticia', async () => {
        const newNews = {
            title: 'Nueva Noticia',
            description: 'Nueva Descripción',
            content: 'Nuevo Contenido',
            author: 'Nuevo Autor',
        };

        const res = await request(app).post('/api/news').send(newNews);
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe(newNews.title);
    });

    it('Debe archivar una noticia', async () => {
        const news = new News({
            title: 'Noticia a Archivar',
            description: 'Descripción a Archivar',
            content: 'Contenido a Archivar',
            author: 'Autor a Archivar',
        });
        const savedNews = await news.save();

        const res = await request(app).put(`/api/news/${savedNews._id}/archive`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.news.archiveDate).toBeDefined(); // La fecha de archivo debe estar definida
    });

    it('Debe eliminar una noticia archivada', async () => {
        const news = new News({
            title: 'Noticia a Eliminar',
            description: 'Descripción a Eliminar',
            content: 'Contenido a Eliminar',
            author: 'Autor a Eliminar',
            archiveDate: Date.now(),
        });
        const savedNews = await news.save();

        const res = await request(app).delete(`/api/news/${savedNews._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Noticia eliminada');
    });

    // Manejo de Errores:
    it('Debe devolver un error al obtener noticias cuando ocurre un error en la base de datos', async () => {
        jest.spyOn(News, 'find').mockImplementationOnce(() => {
            throw new Error('Error en la base de datos');
        });

        const res = await request(app).get('/api/news');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toBe('Error al obtener noticias');
    });

    it('Debe devolver un error al archivar una noticia que no existe', async () => {
        const res = await request(app).put('/api/news/60d5f48e7d3b0c001f500000/archive');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Noticia no encontrada');
    });

    it('Debe devolver un error al intentar eliminar una noticia que no existe', async () => {
        const res = await request(app).delete('/api/news/60d5f48e7d3b0c001f500000');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Noticia no encontrada');
    });

    it('Debe devolver un error al agregar una noticia con un campo requerido faltante', async () => {
        const newNews = {
            description: 'Descripción',
            content: 'Contenido',
            author: 'Autor',
        };

        const res = await request(app).post('/api/news').send(newNews);
        expect(res.statusCode).toEqual(400); // Asumiendo que el modelo lanzará un error
    });

    it('Debe devolver un error al obtener noticias archivadas cuando ocurre un error en la base de datos', async () => {
        jest.spyOn(News, 'find').mockImplementationOnce(() => {
            throw new Error('Error en la base de datos');
        });

        const res = await request(app).get('/api/news/archived');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toBe('Error al obtener noticias archivadas');
    });

    // Pruebas de Integración (consolidadas):
    it('Debe interactuar correctamente con la base de datos al agregar y obtener una noticia', async () => {
        const newNews = {
            title: 'Integración Noticia',
            description: 'Integración Descripción',
            content: 'Integración Contenido',
            author: 'Integración Autor',
        };

        // Agregar noticia
        const postRes = await request(app).post('/api/news').send(newNews);
        expect(postRes.statusCode).toEqual(200);
        expect(postRes.body.title).toBe(newNews.title);

        // Obtener todas las noticias
        const getRes = await request(app).get('/api/news');
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body.news.length).toBe(1);
        expect(getRes.body.news[0].title).toBe(newNews.title);
    });

    it('Debe archivar correctamente una noticia y reflejar el cambio en la base de datos', async () => {
        const news = new News({
            title: 'Integración Archivar Noticia',
            description: 'Descripción de Archivar',
            content: 'Contenido de Archivar',
            author: 'Autor de Archivar',
        });
        const savedNews = await news.save();

        // Archivar noticia
        const archiveRes = await request(app).put(`/api/news/${savedNews._id}/archive`);
        expect(archiveRes.statusCode).toEqual(200);
        expect(archiveRes.body.news.archiveDate).toBeDefined();

        // Verificar que la noticia está archivada
        const updatedNews = await News.findById(savedNews._id);
        expect(updatedNews.archiveDate).toBeDefined();
    });
});
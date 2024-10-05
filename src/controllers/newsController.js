const News = require('../models/newsModel');

// Obtener noticias con paginación
exports.getAllNews = async (req, res) => {
    // Obtener parámetros de consulta de la solicitud
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 30; 

    try {
        // Calcular el número de documentos a omitir
        const skip = (page - 1) * limit;

        // Obtener noticias que no están archivadas y ordenarlas por fecha
        const news = await News.find({ archiveDate: null })
            .sort({ date: -1 }) 
            .skip(skip) 
            .limit(limit); 

        // Contar el total de noticias
        const count = await News.countDocuments({ archiveDate: null });

        // Calcular el total de páginas
        const totalPages = Math.ceil(count / limit);

        // Enviar respuesta con datos y metadatos de paginación
        res.json({
            totalPages: totalPages,
            currentPage: page,
            totalItems: count,
            news: news, 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener noticias', error: error.message });
    }
};

// Obtener todas las noticias archivadas con paginación
exports.getArchivedNews = async (req, res) => {
    // Obtener parámetros de consulta de la solicitud
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 30;

    try {
        // Calcular el número de documentos a omitir
        const skip = (page - 1) * limit;

        // Obtener noticias archivadas y ordenarlas por fecha de archivo
        const archivedNews = await News.find({ archiveDate: { $ne: null } })
            .sort({ archiveDate: -1 }) 
            .skip(skip) 
            .limit(limit); 

        // Contar el total de noticias archivadas
        const count = await News.countDocuments({ archiveDate: { $ne: null } });

        // Calcular el total de páginas
        const totalPages = Math.ceil(count / limit);

        // Enviar respuesta con datos y metadatos de paginación
        res.json({
            totalPages: totalPages,
            currentPage: page,
            totalItems: count,
            news: archivedNews, 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener noticias archivadas', error: error.message });
    }
};

// Archivar una noticia
exports.archiveNews = async (req, res) => {
    try {
        const { id } = req.params;        
        const news = await News.findOne({ _id: id });

        if (!news) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        news.archiveDate = Date.now();
        await news.save();

        res.json({ message: 'Noticia archivada', news });
    } catch (error) {
        res.status(500).json({ message: 'Error al archivar noticia', error: error.message });
    }
};

// Eliminar una noticia archivada
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);
        
        if (!news) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }

        await news.deleteOne();

        res.json({ message: 'Noticia eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar noticia', error: error.message });
    }
};

// Agregar una nueva noticia
exports.addNews = async (req, res) => {
    const { title, description, content, author } = req.body;

    // Validar que todos los campos sean proporcionados
    if (!title || !description || !content || !author) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const { title, description, content, author } = req.body;

        const newNews = new News({
            title,
            description,
            content,
            author,
        });

        await newNews.save();

        res.json(newNews);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar noticia', error: error.message });
    }
};
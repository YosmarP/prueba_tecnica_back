const express = require('express');
const { getAllNews, archiveNews, deleteNews, addNews, getArchivedNews } = require('../controllers/newsController');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Obtiene todas las noticias
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         description: Número de la página que se desea obtener
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: limit
 *         in: query
 *         required: true
 *         description: Cantidad de noticias a devolver por página
 *         schema:
 *           type: integer
 *           format: int32
 *     responses:
 *       200:
 *         description: Lista de noticias
 *       400:
 *         description: Parámetros de consulta no válidos
 *       500:
 *         description: Error del servidor
 */
router.get('/news', getAllNews);          
router.get('/news/archived', getArchivedNews);       
router.post('/news', addNews);            
router.put('/news/:id/archive',validateObjectId, archiveNews); 
router.delete('/news/:id',validateObjectId, deleteNews);   

module.exports = router;
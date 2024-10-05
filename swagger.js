const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Versión de OpenAPI
        info: {
            title: 'API de Noticias',
            version: '1.0.0',
            description: 'Documentación de la API de Noticias',
        },
        servers: [
            {
                url: 'http://localhost:3000', 
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Rutas donde se encuentran tus comentarios de Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
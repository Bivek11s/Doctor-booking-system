const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition:{
        openapi: '3.1.0',
        info: {
            title: 'Doctor Appointment API',
            version: '1.0.0',
            description: 'API for Doctor Appointment',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ]
    },
    apis: [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../models/*.js')]
};

const swaggerDocs = swaggerJsdoc(options);
module.exports = swaggerDocs;
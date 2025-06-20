const swaggerAutogen = require('swagger-autogen');

//Ruta del archivo de configuracion, que saldra
const outputFile = './swagger.json';
//Archivo de entrada, donde se llamara a los endpoints
const endPointsFiles = ['../src/models/server.js'];

//Documentacion de la API REST
const doc = {
    info: {
        title: 'API REST Cafeteria',
        description: 'Esta API permite el manejo de una cafeteria'
    },
    host: 'localhost:8080',
    //protocolo http, https
    schemes: ['http']  
}

swaggerAutogen()(outputFile, endPointsFiles, doc);
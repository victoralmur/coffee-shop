const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('../../docs/swagger.json');
const { dbConnection } = require('../../database/config');

class Server {

    constructor(){
        this.app = express();
        //Con process.env.PORT obtenemos el valor de la variable PORT, que esta en el archivo .env
        this.port = process.env.PORT;
        this.docPatch = '/api/doc';
        //Conectar a base de datos
        this.middlewares();
        this.routes();
        this.conectarDB();
    }

    middlewares(){
        //Para uso de la peticion http: POST, PUT, PATCH
        //Por defecto en el body se puede enviar 1 MB,
        //cuando se envia archivos en base 64 el tamaño se incrementa
        this.app.use(express.json({
            limit: '50mb'
        }));
        //Se publica la carpeta public, para contenido estatico
        this.app.use(express.static('public'));
        //CORS
        //De esta manera acceden a todas las paginas
        this.app.use(cors());
        //fileUpload, para la carga de archivos
        this.app.use(fileUpload({
        //Uar archivos temporales
        useTempFiles : true,
        //Usar un directorio temporal
        tempFileDir : '/tmp/',
        }));
        //Se coloca la documentacion
        this.app.use(this.docPatch, swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));
    }

    routes(){
        //Ruta extendida
        this.app.use('/api/users', require('../routes/userRoute'));
        this.app.use('/api/auth', require('../routes/authRoute'));
        this.app.use('/api/categories', require('../routes/categoryRoute'));
        this.app.use('/api/products', require('../routes/productRoute'));
        this.app.use('/api/typicode', require('../routes/typicodeRoute'));
    }

    async conectarDB(){
        await dbConnection();
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
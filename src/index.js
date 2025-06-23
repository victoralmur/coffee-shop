//Obtenemos el paquete dotenv
require('dotenv').config({ path: './.env' });
const { Server } = require('./models');

const server = new Server();

server.listen();
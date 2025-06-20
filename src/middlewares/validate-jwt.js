//request y response para tener intellisense
const { request, response } = require("express");
const jwt = require('jsonwebtoken');

const { User } = require('../models');

//Middleware personalizado
const validateJWT = async (req = request, res = response, next) => {
    try {
        const header = req.header('Authorization') || '';
        
        if(!header){
            return res.status(401).json({
                error: 'No existe un token en la peticion'
            });
        }

        const token = header.split(' ');

        if(token.length !== 2 || token[0] !== 'Bearer' || !token[1]){
            return res.status(401).json({
                error: 'El token no tiene el formato correcto'
            });
        }
        
        //Verificamos la autenticidad del token
        //El resultado es el token decodificado
        const { uuid } = jwt.verify(token[1], process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uuid);

        if(!user){
            return res.status(401).json({
                error: `El id ${uuid} no existe`
            }); 
        }

        //Verificar si el uuid tiene estado true
        if(!user.Status){
            return res.status(401).json({
                error: `El id ${uuid} ya fue eliminado`
            });
        }
        
        //Adicionar el usuario, como propiedad del req (request)
        req.user = user;
        
        //next se ejecutara, cuando se requiera salir del middleware
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: 'Token no valido'
        });
    }
}

module.exports = {
    validateJWT
}
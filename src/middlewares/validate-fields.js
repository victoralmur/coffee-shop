//request y response para tener intellisense
const { request, response } = require("express");
const { validationResult } = require("express-validator");

//next es lo que se llama si el middleware pasa
//quiere decir que continue con el siguiente middleware
//si no hay el middleware continua con el controlador
const validateFields = (req = request, res = response, next ) => {
    //Extrae los errores de validacion
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    //next se ejecutara, cuando se requiera salir del middleware
    next();
}

module.exports = {
    validateFields
}
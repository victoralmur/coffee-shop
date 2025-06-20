const { request, response } = require("express")

const validateUploadFile = (req = request, res = response, next) => {
    //Con req.files accedo a los archivos, que se envian desde el cliente
    if (!req.files || Object.keys(req.files).length === 0  || !req.files.file) {
        return res.status(400).json({
            error: 'El archivo es obligatorio'
        });
    }

    next();
}

module.exports = {
    validateUploadFile
}
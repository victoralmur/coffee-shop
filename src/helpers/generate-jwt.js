const jwt = require('jsonwebtoken');

const generateJWT = (uuid = '') => {
    return new Promise((resolve, reject) => {

        const payload = { uuid };
        //Tiene 3 parametros:
        //El payload del mensaje
        //La clave publica
        //Tiempo de expiracion
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (error, token) => {
            if(error){
                console.log(error);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
}

const parseJWT = (token) => {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
}

module.exports = {
    generateJWT,
    parseJWT
}
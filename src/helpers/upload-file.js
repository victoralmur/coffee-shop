
const validateFileExtension = (files, mymeTypes = []) => {

    return new Promise((resolve, reject) => {
        const { file } = files;

        //Validar la extension del archivo
        if(!mymeTypes.includes(file.mimetype)){
            return reject('El archivo no tiene la extension correcta');
        }

        return resolve('Archivo con extension correcta');
    });
}

const validateBase64FileExtension = (base64File, mymeTypes = []) => {

    return new Promise((resolve, reject) => {
        
        const base64 = base64File.split(',')[1];
        if(!base64)
            return reject('El archivo no tiene base 64');

        atob(base64);
        const mymeType = ((base64File.split(',')[0]).split(':')[1]).split(';')[0];
        
        if(!mymeTypes.includes(mymeType)){
            return reject('El archivo no tiene la extension correcta');

        }

        return resolve('El archivo es de base 64')
    });
}

module.exports = {
    validateFileExtension,
    validateBase64FileExtension
}
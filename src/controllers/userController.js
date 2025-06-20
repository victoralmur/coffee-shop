//request y response para tener intellisense
const { request, response } = require("express");
//npm i bcryptjs@2.4.3, se utiliza esta version porque la version actual maneja typescript
const bcryptjs = require('bcryptjs');
//La libreria para el uso de cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { validateFileExtension } = require("../helpers/upload-file");

const { User } = require('../models');

const userPaginate = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { Status: true };

    const [total, users] = await Promise.all([
        //Cantidad total de registros, de una coleccion
        User.countDocuments(query),
        User.find(query)
        //Con skip, se coloca el numero posterior de registro que iniciara
        //Si se coloca 2, empezara en el 3
        .skip(Number(from))
        //Con limit, se limita la cantidad de pagina
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        users
    });
}

const userById = async (req = request, res = response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);
}

const userByUserNameEmail = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const { name } = req.params;

    //Para la busqueda de un termino por coincidencia (LIKE en SQL), se usa una expresion regular
    //La i significa que no es sensible a mayusculas y minusculas
    const regex = new RegExp(name, 'i');

    const queryCoincidence = [{ userName: regex }, { Email: regex }];
    const queryStatus = [{ Status: true }];

    const [total, users] = await Promise.all([
        User.countDocuments({
            $or: queryCoincidence,
            $and: queryStatus
        }),
        User.find({
            $or: queryCoincidence,
            $and: queryStatus
        })
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        users
    });                        
}

const userPost = async (req = request, res = response) => {
    const body = req.body;
    const { Password } = body;
    const user = new User(body);

    //Encriptar la contraseña
    //genSaltSync() numero de veces que genera la encriptacion, se coloca 10 por defecto
    const salt = bcryptjs.genSaltSync(10);
    //hashSync() encripta en un solo sentido (hash)
    user.Password = bcryptjs.hashSync(Password, salt);

    await user.save();

    res.status(201).json(user);
}

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    //Obtengo el Email para no actualizarlo
    const { Email, Password, ...content } = req.body;

    if(Password){
        //Encriptar la contraseña
        //genSaltSync() numero de veces que genera la encriptacion, se coloca 10 por defecto
        const salt = bcryptjs.genSaltSync(10);
        //hashSync() encripta en una solo sentido (hash)
        content.Password = bcryptjs.hashSync(Password, salt);
    }

    //{ new: true } significa que devolvera el modelo actualizado
    const updateUser = await User.findByIdAndUpdate(id, content, { new: true });

    res.status(200).json(updateUser);
}

const userUpdateImage = async (req = request, res = response) => {

    try {
        await validateFileExtension(req.files, ['image/png', 'image/jpeg', 'image/gif']);

        const { id } = req.params;
        const folder = { folder: 'users' };

        const user = await User.findById(id);
        
        //Eliminar imagenes previas
        //Verificar si tiene la clave Image
        if(user.Image){
            //Obteniendo el nombre y extension de la imagen
            //pop remueve el ultimo elemento del array, retorna el elemento que se a removido
            const nameExtensionImage = user.Image.split('/').pop();
            //shift remueve el primer elemento del array, retorna el elemento que a removido
            const publicImageId = nameExtensionImage.split('.').shift();

            //Borrar imagen de cloudinary
            //El parametro que se necesita es el nombre de la imagen
            //Se coloca: nombre_carpeta/nombre_imagen
            await cloudinary.uploader.destroy(`${folder['folder']}/${publicImageId}`);
        }

        //tempFilePath es la ruta, donde esta el archivo de forma temporal
        const { tempFilePath } = req.files.file;

        //secure_url es una url segura, con el protocolo https
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, folder);
        user.Image = secure_url;

        await user.save();
        
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        
        res.status(400).json({
            error: 'Hubo problemas para subir el archivo'
        });
    }
}

const userDelete = async (req = request, res = response) => {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { Status: false });

    res.status(200).json({
        mensaje: 'Usuario eliminado'
    });
}

module.exports = {
    userPaginate,
    userById,
    userByUserNameEmail,
    userPost,
    userPut,
    userUpdateImage,
    userDelete
}
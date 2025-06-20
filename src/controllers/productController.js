const { request, response } = require('express');
const { validateBase64FileExtension } = require('../helpers/upload-file');
//La libreria para el uso de cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Product } = require('../models');

const productPaginate = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { Status: true };
    
    const [total, products] = await Promise.all([
        //Cantidad total de registros, de una coleccion
        Product.countDocuments(query),
        Product.find(query)
        //Con populate, se reemplaza un campo en un documento, con la informacion actual
        //desde un documento relacionado
        //Primer parametro la propiedad relacionada a una coleccion
        //Segundo parametro la propiedad que se mostrara, de dicha coleccion
        .populate('idUser', 'userName')
        .populate('idCategory', 'Name')
        //Con skip, se coloca el numero posterior de registro que iniciara
        //Si se coloca 2, empezara en el 3
        .skip(Number(from))
        //Con limit, se limita la cantidad de pagina
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        products
    });
}

const productById = async (req = request, res = response) => {
    const { id } = req.params;
        
    const product = await Product.findById(id)
                                  .populate('idUser', 'userName')
                                  .populate('idCategory', 'Name');

    res.status(200).json(product);
}

const productByName = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const { name } = req.params;

    //Para la busqueda de un termino por coincidencia (LIKE en SQL), se usa una expresion regular
    //La i significa que no es sensible a mayusculas y minusculas
    const regex = new RegExp(name, 'i');

    const query = { Name: regex, Status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('idUser', 'userName')
        .populate('idCategory', 'Name')
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        products
    });                        
}

const productPost = async (req = request, res = response) => {
    const body = req.body;

    const newProduct = {
        ...body,
        idUser: req.user._id
    }

    const product = new Product(newProduct);

    await product.save();

    res.status(201).json(product);
}

const productPut = async (req = request, res = response) => {
    const { id } = req.params;
    const body = req.body;

    const product = {
        ...body,
        idUser: req.user._id
    }

    const updateProduct = await Product.findByIdAndUpdate(id, product, { new: true });

    res.status(200).json(updateProduct);
}

const productUpdateImage = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const { base64File } = req.body
        const folder = { folder: 'products' };

        await validateBase64FileExtension(base64File, ['image/png', 'image/jpeg', 'image/gif']);

        const product = await Product.findById(id);
        
        //Eliminar imagenes previas
        //Verificar si tiene la clave Image
        if(product.Image){
            //Obteniendo el nombre y extension de la imagen
            //pop remueve el ultimo elemento del array, retorna el elemento que se a removido
            const nameExtensionImage = product.Image.split('/').pop();
            //shift remueve el primer elemento del array, retorna el elemento que a removido
            const publicImageId = nameExtensionImage.split('.').shift();

            //Borrar imagen de cloudinary
            //El parametro que se necesita es el nombre de la imagen
            //Se coloca: nombre_carpeta/nombre_imagen
            await cloudinary.uploader.destroy(`${folder['folder']}/${publicImageId}`);
        }

        //secure_url es una url segura, con el protocolo https
        const { secure_url } = await cloudinary.uploader.upload(base64File, folder);
        product.Image = secure_url;

        await product.save();
        
        res.status(200).json(product);

    } catch (error) {
        console.log(error);

        res.status(400).json({
            error: 'Hubo problemas para subir el archivo'
        });
    }
}

const productDelete = async (req = request, res = response) => {
    const { id } = req.params;
    
    await Product.findByIdAndUpdate(id, { Status: false });

    res.status(200).json({
        mensaje: 'Producto eliminado'
    });
}

module.exports = {
    productPaginate,
    productById,
    productByName,
    productPost,
    productPut,
    productUpdateImage,
    productDelete
}
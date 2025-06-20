const { request, response } = require("express")

const { Category } = require('../models');

const categoryPaginate = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { Status: true };

    const [total, categories] = await Promise.all([
        //Cantidad total de registros, de una coleccion
        Category.countDocuments(query),
        Category.find(query)
        //Con populate, se reemplaza un campo en un documento, con la informacion actual
        //desde un documento relacionado
        //Primer parametro la propiedad relacionada a una coleccion
        //Segundo parametro la propiedad que se mostrara, de dicha coleccion
        .populate('idUser', 'userName')
        //Con skip, se coloca el numero posterior de registro que iniciara
        //Si se coloca 2, empezara en el 3
        .skip(Number(from))
        //Con limit, se limita la cantidad de pagina
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        categories
    });
}

const categoryById = async (req = request, res = response) => {
    const { id } = req.params;
    
    const category = await Category.findById(id)
                                   .populate('idUser', 'userName');

    res.status(200).json(category);
}

const categoryPost = async (req = request, res = response) => {
    const { Name } = req.body;
    const name = Name.toUpperCase();

    const newCategory = {
        Name: name,
        idUser: req.user._id
    };

    const category = new Category(newCategory);

    await category.save();

    res.status(201).json(category);
}

const categoryPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { Name } = req.body;

    const name = Name.toUpperCase();

    const category = {
        Name: name,
        idUser: req.user._id
    };

    const updateCategory = await Category.findByIdAndUpdate(id, category, { new: true });
    
    res.status(200).json(updateCategory);
}

const categoryDelete = async (req = request, res = response) => {
    const { id } = req.params;

    await Category.findByIdAndUpdate(id, { Status: false });

    res.status(200).json({
        mensaje: 'Categoria eliminada'
    });
}

module.exports = {
    categoryPaginate,
    categoryById,
    categoryPost,
    categoryPut,
    categoryDelete
}
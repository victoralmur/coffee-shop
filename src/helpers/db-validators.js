const { User, Category, Product } = require('../models');

const userExist = async (userName = '') => {
    const user = await User.findOne({ userName });

    if(user){
        throw new Error(`El nombre de usuario ${userName} ya existe`);
    }
}

const userEmailExist = async (Email = '') => {
    //Verificar que el email existe
    const user = await User.findOne({ Email });

    if(user){
        throw new Error(`El email ${Email} ya existe`);
    }
}

const existUserById = async (id) => {
    //Verificar si el usuario existe
    const user = await User.findById(id);

    if(!user){
        throw new Error(`El id ${id} no existe`);
    }
}

const existUserDeleted = async (id) => {
    const user = await User.findById(id);
    
    if(user){
        if(!user.Status)
            throw new Error(`El id ${id} ya fue eliminado`);
    }
}

const existCategoryName = async (Name = '') => {
    const name = Name.toUpperCase();
    const category = await Category.findOne({ Name: name });

    if(category){
        throw new Error(`La categoria ${Name} ya existe`);
    }
}

const existCategoryById = async (id) => {
    const category = await Category.findById(id);

    if(!category){
        throw new Error(`El id ${id} no existe`);
    }
}

const existCategoryDeleted = async (id) => {
    const category = await Category.findById(id);

    if(category){
        if(!category.Status)
            throw new Error(`El id ${id} ya fue eliminado`);
    }
}

const existProductName = async (Name = '') => {
    const product = await Product.findOne({ Name });

    if(product){
        throw new Error(`El producto ${Name} ya existe`);
    }
}

const existProductById = async (id) => {
    const product = await Product.findById(id);

    if(!product){
        throw new Error(`El id ${id} no existe`);
    }
}

const existProductDeleted = async (id) => {
    const product = await Product.findById(id);

    if(product){
        if(!product.Status)
            throw new Error(`El id ${id} ya fue eliminado`);
    }
}

module.exports = {
    userExist,
    userEmailExist,
    existUserById,
    existUserDeleted,
    existCategoryName,
    existCategoryById,
    existCategoryDeleted,
    existProductName,
    existProductById,
    existProductDeleted
}
const authController = require('./authController');
const categoryController = require('./categoryController');
const productController = require('./productController');
const typicodeController = require('./typicodeController');
const userController = require('./userController');
const utilsController = require('./utilsController');

module.exports = {
    ...authController,
    ...categoryController,
    ...productController,
    ...typicodeController,
    ...userController,
    ...utilsController
}
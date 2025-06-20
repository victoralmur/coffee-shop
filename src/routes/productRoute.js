const { Router } = require('express');
const { check } = require('express-validator');

const { productPost, productPaginate, productPut, productById, productDelete, productByName, productUpdateImage } = require('../controllers');

const { validateFields, validateJWT, hasRole } = require('../middlewares');
const { existProductName, existCategoryById, existProductById, existProductDeleted } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('limit', 'No es un valor numerico').isNumeric().optional(),
    check('from', 'No es un valor numerico').isNumeric().optional(),
    validateFields
    ],
    productPaginate);

router.get('/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existProductById),
    check('id').custom(existProductDeleted),
    validateFields
    ],
    productById);

router.get('/search/name/:name', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('limit', 'No es un valor numerico').isNumeric().optional(),
    check('from', 'No es un valor numerico').isNumeric().optional(),
    validateFields
    ],
    productByName);

router.post('/', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('Name', 'El nombre es obligatorio').notEmpty(),
    check('Price', 'El precio es obligatorio').notEmpty(),
    check('Description', 'La descripcion es obligatoria').notEmpty(),
    check('Name').custom(existProductName),
    check('idCategory', 'No es un id valido').isMongoId(),
    check('idCategory').custom(existCategoryById),
    validateFields
    ],
    productPost);

router.put('/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existProductById(id)),
    check('id').custom(existProductDeleted),
    check('Name', 'El nombre es obligatorio').notEmpty(),
    check('Price', 'El precio es obligatorio').notEmpty(),
    check('Description', 'La descripcion es obligatoria').notEmpty(),
    check('Name').custom(existProductName),
    check('idCategory', 'No es un id valido').isMongoId(),
    check('idCategory').custom(existCategoryById),
    
    ],
    productPut);

router.put('/upload/file/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existProductById(id)),
    check('id').custom(existProductDeleted),
    validateFields
    ],
    productUpdateImage);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existProductById(id)),
    check('id').custom(existProductDeleted),
    validateFields
    ],
    productDelete);

module.exports = router;
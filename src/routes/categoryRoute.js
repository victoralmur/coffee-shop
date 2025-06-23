const { Router } = require('express');
const { check } = require('express-validator');

const { categoryPaginate, categoryPost, categoryById, categoryPut, categoryDelete, wildcard } = require('../controllers');

const { validateFields, validateJWT, hasRole } = require('../middlewares');
const { existCategoryName, existCategoryById, existCategoryDeleted } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('limit', 'No es un valor numerico').isNumeric().optional(),
    check('from', 'No es un valor numerico').isNumeric().optional(),
    validateFields
    ],
    categoryPaginate);

router.get('/:id',[
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existCategoryById),
    check('id').custom(existCategoryDeleted),
    validateFields
    ],
    categoryById);

router.post('/', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('Name', 'El nombre es obligatorio').notEmpty(),
    check('Name').custom(existCategoryName),
    validateFields
    ],
    categoryPost);

router.put('/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existCategoryById),
    check('id').custom(existCategoryDeleted),
    check('Name', 'El nombre es obligatorio').notEmpty(),
    check('Name').custom(existCategoryName),
    validateFields
    ],
    categoryPut);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existCategoryById),
    check('id').custom(existCategoryDeleted),
    validateFields
    ],
    categoryDelete);

router.all('*splat', wildcard);

module.exports = router;
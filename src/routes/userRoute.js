const { Router } = require('express');
const { check } = require('express-validator');

const { userPaginate, userById, userByUserNameEmail, userPost, userPut, userUpdateImage, userDelete } = require('../controllers');

const { userEmailExist, existUserById, existUserDeleted, userExist } = require('../helpers/db-validators');

const { validateFields, validateJWT, hasRole, validateUploadFile } = require('../middlewares');

const router = Router();

router.get('/', [
    validateJWT,
    //Solo los usuarios con el rol administrador y usuario, pueden obtener usuarios
    //Los valores del parametro van como array
    hasRole('ADMIN', 'USER'),
    check('limit', 'No es un valor numerico').isNumeric().optional(),
    check('from', 'No es un valor numerico').isNumeric().optional(),
    validateFields
    ],
    userPaginate);

router.get('/:id', [
    validateJWT,
    //Solo los usuarios con el rol administrador y usuario, pueden obtener un usuario
    //Los valores del parametro van como array
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existUserById(id)),
    check('id').custom(existUserDeleted),
    validateFields
    ],
    userById);

router.get('/search/name/:name', [
    validateJWT,
    hasRole('ADMIN'),
    check('limit', 'No es un valor numerico').isNumeric().optional(),
    check('from', 'No es un valor numerico').isNumeric().optional(),
    validateFields
    ],
    userByUserNameEmail);

router.post('/',[
    /*
    Funcion check:
    Primer parametro, propiedad del body
    Segundo parametro, mensaje si no cumple la validacion
    Funcion(es) de validacion
    Custom(s) Middleware
    */
   validateJWT,
    //Solo los usuarios con el rol administrador y usuario, pueden adicionar usuarios
    //Los valores del parametro van como array
    hasRole('ADMIN', 'USER'),
    check('userName', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('userName').custom(userName => userExist(userName)),
    check('Name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('Email', 'El email no tiene el formato correcto').isEmail(),
    //custom() es un error personalizado
    //custom(emailExiste)
    check('Email').custom(Email => userEmailExist(Email)),
    check('Password', 'La contraseña de tener 6 o mas caracteres').isLength(6),
    check('Role', 'No es un rol valido').isIn(['ADMIN', 'USER']),
    validateFields
    ],
    userPost);

router.put('/:id', [
    validateJWT,
    //Solo los usuarios con el rol administrador y usuario, pueden modificar usuarios
    //Los valores del parametro van como array
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existUserById(id)),
    check('id').custom(existUserDeleted),
    check('userName', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('Name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('Email', 'El email no tiene el formato correcto').isEmail(),
    check('Password', 'La contraseña de tener 6 o mas caracteres').isLength(6),
    check('Role', 'No es un rol valido').isIn(['ADMIN', 'USER']),
    validateFields
    ],
    userPut);

router.put('/upload/file/:id', [
    validateJWT,
    hasRole('ADMIN', 'USER'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(id => existUserById(id)),
    check('id').custom(existUserDeleted),
    validateUploadFile,
    validateFields
    ],
    userUpdateImage
    );

router.delete('/:id', [
    validateJWT,
    //Solo los usuarios con el rol administrador, pueden eliminar usuarios
    //Los valores del parametro van como array
    hasRole('ADMIN'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existUserById),
    check('id').custom(existUserDeleted),
    validateFields
    ],
    userDelete);

module.exports = router;
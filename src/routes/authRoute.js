const { Router } = require('express');
const { check } = require('express-validator');

const { login, refreshJWT, wildcard } = require('../controllers');

const { validateFields } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('Email', 'El email es obligatorio').notEmpty(),
    check('Password', 'La contraseña es obligatoria').notEmpty(),
    validateFields
    ],
    login);

router.get('/refresh-token', refreshJWT);

router.all('*splat', wildcard);

module.exports = router;
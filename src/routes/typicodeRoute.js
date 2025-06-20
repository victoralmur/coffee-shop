const { Router } = require('express');

const { getTypeCode } = require('../services/typicodeService');

const { validateFields, validateJWT, hasRole } = require('../middlewares');

const router = Router();

router.get('/users', [
    
    ],
    getTypeCode);

module.exports = router;
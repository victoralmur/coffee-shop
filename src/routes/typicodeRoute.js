const { Router } = require('express');

const { wildcard, getTypicode } = require('../controllers');

const router = Router();

router.get('/users', getTypicode);

router.all('*splat', wildcard);

module.exports = router;
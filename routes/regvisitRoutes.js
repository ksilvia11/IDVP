const express = require('express');
const router = express.Router();
const { regVisit, lastVisit, regVisitPost } = require('../controllers/regvisitControllers');

router.get('/regivisit', regVisit);
router.get('/lastvisit', lastVisit);
router.post('/regivisit', regVisitPost);

module.exports = router;
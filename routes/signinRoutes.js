const express = require('express');

const router = express.Router();


//kasutatavad kontrollerid
const {
	signinPage,
	signinPagePost
	} = require('../controllers/signinControllers');

router.route('/').get(signinPage);

router.route('/').post(signinPagePost);

//moodul
module.exports = router;
const express = require('express');

const router = express.Router();


//kasutatavad kontrollerid
const {
	signupPage,
	signupPagePost
	} = require('../controllers/signupControllers');

router.route('/').get(signupPage);

router.route('/').post(signupPagePost);

//moodul
module.exports = router;
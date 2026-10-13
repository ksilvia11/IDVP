const express = require('express');
const router = express.Router();

//kasutatavad kontrollerid
const {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	eestifilmfilmid,
	filmAdd,
	filmAddPost,
	ametid,
	ametidAdd,
	ametidAddPost
	} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);
// inimesed
router.route('/inimesed').get(inimesed);

router.route('/inimesed_lisa').get(inimesedAdd);

router.route('/inimesed_lisa').post(inimesedAddPost);
//filmid
router.route('/filmid').get(eestifilmfilmid);

router.route('/filmid_add').get(filmAdd);

router.route('/filmid_add').post(filmAddPost);
//ametid
router.route('/ametid').get(ametid);

router.route('/ametid_add').get(ametidAdd);

router.route('/ametid_add').post(ametidAddPost);

//moodul
module.exports = router;
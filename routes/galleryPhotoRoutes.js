const express = require('express');
const multer = require('multer');

const router = express.Router();

//kasutatavad kontrollerid
const {
	galleryGet
	} = require('../controllers/galleryPhotoControllers');

router.route('/').get(galleryGet);


//moodul
module.exports = router;
const express = require('express');
const auth = require('../middleware/auth');
const uploadMedia = require('../middleware/uploadMedia');
const {
	getAllMedia,
	uploadMedia: uploadMediaController,
	deleteMedia,
	getEmailHistory,
	sendEmail
} = require('../controllers/mediaController');

const router = express.Router();

router.use(auth);

router.get('/', getAllMedia);
router.post('/', uploadMedia.array('files'), uploadMediaController);
router.get('/email/history', getEmailHistory);
router.post('/email', sendEmail);
router.delete('/:id', deleteMedia);

module.exports = router;

const router = require('express').Router();
const { validateUserUpdate } = require('../utils/validators');

const { getUser, updateUser, updateAvatar, updateBio, updateStatus } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', updateUser);
router.patch("/status", updateStatus);
router.patch("/me/avatar", updateAvatar);
router.patch("/me/bio", updateBio);

module.exports = router;

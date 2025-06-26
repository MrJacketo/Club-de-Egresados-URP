const express = require('express');
const router = express.Router();
const {
  createOrUpdateUserProfile,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  disableUser
} = require('../controllers/userController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

router.post('/admin/user',verifyFirebaseToken, createOrUpdateUserProfile);
router.get('/:uid',getUserProfile);
router.get('/',verifyFirebaseToken, getAllUsers);
router.put('/update-user-profile',verifyFirebaseToken, updateUserProfile);
router.put('/disable/:userId', verifyFirebaseToken,disableUser);

module.exports = router;
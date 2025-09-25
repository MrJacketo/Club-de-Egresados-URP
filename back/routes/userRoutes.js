const express = require('express');
const router = express.Router();
const {
  createOrUpdateUserProfile,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  disableUser
} = require('../controllers/userController');
const verifyJWTToken = require('../middleware/verifyJWTToken');

router.post('/admin/user',verifyJWTToken, createOrUpdateUserProfile);
router.get('/:uid',getUserProfile);
router.get('/',verifyJWTToken, getAllUsers);
router.put('/update-user-profile',verifyJWTToken, updateUserProfile);
router.put('/disable/:userId', verifyJWTToken,disableUser);

module.exports = router;
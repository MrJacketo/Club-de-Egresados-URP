const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyJWTToken = require('../middleware/verifyJWTToken');

const {
  createOrUpdateUserProfile,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  disableUser,
  uploadProfilePhoto
} = require('../controllers/userController');

// --- CONFIGURACIÓN DE MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_photos/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// --------------------------------

// RUTAS
router.post('/admin/user', verifyJWTToken, createOrUpdateUserProfile);
router.get('/:uid', getUserProfile);
router.get('/', verifyJWTToken, getAllUsers);
router.put('/update-user-profile', verifyJWTToken, updateUserProfile);
router.put('/disable/:userId', verifyJWTToken, disableUser);

// ✅ Nueva ruta para subir foto
router.post('/upload-photo', verifyJWTToken, upload.single('photo'), uploadProfilePhoto);

module.exports = router;

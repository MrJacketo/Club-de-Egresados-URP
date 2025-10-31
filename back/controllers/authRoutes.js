const express = require('express');
const router = express.Router();
const { 
    test, 
    registerUser, 
    loginUser, 
    getUserName, 
    getCurrentUser, 
    updateUserAcademicData 
} = require('../controllers/authController');
const { verifyJWTToken } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/test', test);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rutas protegidas
router.get('/user-name', verifyJWTToken, getUserName);
router.get('/current-user', verifyJWTToken, getCurrentUser);
router.put('/academic-data', verifyJWTToken, updateUserAcademicData);

module.exports = router;
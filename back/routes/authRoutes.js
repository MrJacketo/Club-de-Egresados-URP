const express = require('express');
const router = express.Router();
const cors = require('cors');
const verifyJWTToken = require('../middleware/verifyJWTToken');
const { test, registerUser, loginUser, getUserName, getCurrentUser, updateUserAcademicData } = require('../controllers/authController');

// Middleware
router.use(
    cors({
        credentials: true,
        origin: 'https://silver-succotash-g9r9j75rqg626j5-5173.app.github.dev' //codespace
        //origin: 'http://localhost:5173',
    })
);

// Public routes
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/user-name', verifyJWTToken, getUserName);
router.get('/current-user', verifyJWTToken, getCurrentUser);
router.put('/update-academic-data', verifyJWTToken, updateUserAcademicData);

module.exports = router;
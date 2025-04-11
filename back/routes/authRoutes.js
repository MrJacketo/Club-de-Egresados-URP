const express = require('express');
const router = express.Router();
const cors = require('cors');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { test, registerUser, loginUser, getUserName } = require('../controllers/authController');

// Middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })
);

// Public routes
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/user-name', verifyFirebaseToken, getUserName);

module.exports = router;
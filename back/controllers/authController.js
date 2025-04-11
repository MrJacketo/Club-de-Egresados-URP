const admin = require('../firebase'); // Firebase Admin SDK

// Test route
const test = (req, res) => {
    res.json('El servidor está funcionando correctamente');
};

// Register a new user (if needed)
const registerUser = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await admin.auth().createUser({
            email,
            password: contraseña,
            displayName: nombre,
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Login user (handled on the frontend with Firebase Authentication)
const loginUser = async (req, res) => {
    res.status(400).json({ error: 'El inicio de sesión debe manejarse en el frontend con Firebase Authentication' });
};

// Get the user's name from the Firebase token
const getUserName = async (req, res) => {
    const user = req.user; // Extracted from the verifyFirebaseToken middleware

    if (!user) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    res.json({ name: user.name || user.displayName });
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getUserName,
};
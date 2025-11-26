const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Membresia = require('../models/Membresia');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Test route
const test = (req, res) => {
    res.json('El servidor está funcionando correctamente');
};

// Register a new user
const registerUser = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe con este email' });
        }

        // Create new user
        const user = new User({
            name: nombre,
            email,
            password: contraseña, // Will be hashed by the pre-save middleware
        });

        await user.save();

        // Create inactive membership for the new user
        const membresia = new Membresia({
            userId: user._id,
            estado: 'inactiva',
            fechaActivacion: null,
            fechaVencimiento: null
        });

        await membresia.save();

        // Generate token
        const token = generateToken(user._id);

        // Return user data (excluding password) and token
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            activo: user.activo,
            rol: user.rol,
            createdAt: user.createdAt
        };

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            user: userResponse,
            token 
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Check if user is active
        if (!user.activo) {
            return res.status(401).json({ error: 'Usuario inactivo' });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data (excluding password) and token
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            activo: user.activo,
            rol: user.rol,
            createdAt: user.createdAt
        };

        res.json({ 
            message: 'Login exitoso', 
            user: userResponse,
            token 
        });
    } catch (error) {
        console.error('Error al hacer login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Get the user's name from the JWT token
const getUserName = async (req, res) => {
    const user = req.user; // Extracted from the verifyJWTToken middleware

    if (!user) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    res.json({ name: user.name });
};

// Get current user info
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find user by ID to get the most up-to-date data including academic fields
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Return user data including academic fields
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            anioEgreso: user.anioEgreso,
            carrera: user.carrera,
            gradoAcademico: user.gradoAcademico,
            profilePicture: user.profilePicture,
            activo: user.activo,
            rol: user.rol,
            createdAt: user.createdAt
        };

        res.json({ user: userResponse });
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Update user academic data
const updateUserAcademicData = async (req, res) => {
    try {
        const userId = req.user._id;
        const { anioEgreso, carrera, gradoAcademico } = req.body;

        console.log('=== UPDATE USER ACADEMIC DATA ===');
        console.log('User ID:', userId);
        console.log('Request body:', { anioEgreso, carrera, gradoAcademico });

        // Find and update user
        const user = await User.findByIdAndUpdate(
            userId,
            {
                ...(anioEgreso && { anioEgreso }),
                ...(carrera && { carrera }),
                ...(gradoAcademico && { gradoAcademico })
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            console.log('ERROR: Usuario no encontrado con ID:', userId);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('Usuario actualizado exitosamente:', {
            id: user._id,
            anioEgreso: user.anioEgreso,
            carrera: user.carrera,
            gradoAcademico: user.gradoAcademico
        });

        // Return updated user data (excluding password)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            anioEgreso: user.anioEgreso,
            carrera: user.carrera,
            gradoAcademico: user.gradoAcademico,
            profilePicture: user.profilePicture,
            activo: user.activo,
            rol: user.rol,
            createdAt: user.createdAt
        };

        res.json({ 
            message: 'Datos académicos actualizados correctamente',
            user: userResponse 
        });
    } catch (error) {
        console.error('Error updating user academic data:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getUserName,
    getCurrentUser,
    updateUserAcademicData,
};
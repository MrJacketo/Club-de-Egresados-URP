const admin = require('../firebase');

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach user info to the request
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = verifyFirebaseToken;
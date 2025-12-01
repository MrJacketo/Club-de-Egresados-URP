const User = require("../models/User");
const Membresia = require("../models/Membresia")
// Create or update user profile
const createOrUpdateUserProfile = async (req, res) => {
  const userId = req.user._id;
  const userData = req.body;

  try {
    // Check if the user already exists
    let user = await User.findById(userId);

    if (user) {
      // Update existing user profile
      Object.assign(user, userData);
      await user.save();
      return res.json({ message: "Perfil de usuario actualizado exitosamente", user });
    }

    return res.status(404).json({ error: "Usuario no encontrado" });
  } catch (error) {
    console.error("Error creando/actualizando perfil de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get user
const getUserProfile = async (req, res) => {
  const { uid } = req.params; // User ID
  try {
    // Find the user by ID
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: "Perfil de usuario no encontrado" });
    }
    res.json(user);

  } catch (error) {
    console.error("Error obteniendo perfil de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

}

// Obtener todos los usuarios 
const getAllUsers = async (req, res) => {
  try {
    //obtenemos todos los usuarios
    const users = await User.find();

    // Obtener todas las membresías activas
    const membresiasActivas = await Membresia.find({ estado: 'activa' });

    // Agregar la propiedad isMember a cada usuario
    // Crear un Set de UIDs con membresía activa para búsqueda rápida
    const uidsConMembresiaActiva = new Set(
      membresiasActivas.map((m) => m.userId) // Changed from firebaseUid to userId
    );

    // Añadir campo isMember a cada usuario
    const usersConMembresia = users.map((user) => ({
      ...user.toObject(),
      isMember: uidsConMembresiaActiva.has(user._id.toString()), // Changed from firebaseUid to _id
    }));

    // Calcular totales
    const totalUsers = users.length;
    const activeUsers = await User.countDocuments({ activo: true });
    const activeMembers = membresiasActivas.length;


    res.json({
      users : usersConMembresia,
      totalUsers,
      activeUsers,
      activeMembers
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const userId = req.user._id;
  const userData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Perfil de usuario no encontrado" });
    }

    Object.assign(user, userData);
    await user.save();
    res.json({ message: "Perfil de usuario actualizado exitosamente", user });
  } catch (error) {
    console.error("Error actualizando perfil de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const disableUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    estado = user.activo
    user.activo = estado ? false : true; // Cambia el estado de activo a inactivo o viceversa
    user.updatedAt = Date.now(); // Actualiza la fecha de modificación
    await user.save();
    res.json({ message: "Usuario deshabilitado exitosamente", user });
  } catch (error) {
    console.error("Error deshabilitando usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo usuario (solo admin)
const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ error: "Ya existe un usuario con este email" });
    }

    // Crear el nuevo usuario
    const newUser = new User(userData);
    await newUser.save();

    // No devolver la contraseña en la respuesta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      message: "Usuario creado exitosamente", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar usuario existente (solo admin)
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si se incluye email, verificar que no exista otro usuario con ese email
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({ error: "Ya existe un usuario con este email" });
      }
    }

    // Actualizar datos
    Object.assign(user, userData);
    await user.save();

    // No devolver la contraseña en la respuesta
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ 
      message: "Usuario actualizado exitosamente", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createOrUpdateUserProfile,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  disableUser,
  createUser,
  updateUser
}
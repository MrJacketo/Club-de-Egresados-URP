const User = require("../models/User");
const Membresia = require("../models/Membresia")
// Create or update user profile
const createOrUpdateUserProfile = async (req, res) => {
  const firebaseUid = req.user.firebaseUid;
  const userData = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user profile
      Object.assign(user, userData);
      user.updatedAt = Date.now();
      await user.save();
      return res.json({ message: "Perfil de usuario actualizado exitosamente", user });
    }

    // Create a new user profile
    user = new User({ firebaseUid, ...userData });
    await user.save();
    res.json({ message: "Perfil de usuario creado exitosamente", user });
  } catch (error) {
    console.error("Error creando/actualizando perfil de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get user
const getUserProfile = async (req, res) => {
  const {uid} = req.params; // Assuming you pass the user ID
  try{ 
    // Find the user by firebaseUid
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: "Perfil de usuario no encontrado" });
    }
    res.json(user);

  }catch(error){
    console.error("Error obteniendo perfil de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

}

// Obtener todos los usuarios 
const getAllUsers = async (req, res) => {
  try {
    //obtenemos todos los usuarios
    const users = await User.find();

    // Calcular totales
    const totalUsers = users.length;
    const activeUsers = await User.countDocuments({ activo: true });
    const activeMembers = await Membresia.countDocuments({ estado: 'activa' });


    res.json({
      users,
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
  const firebaseUid = req.user.firebaseUid;
  const userData = req.body;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: "Perfil de usuario no encontrado" });
    }

    Object.assign(user, userData);
    user.updatedAt = Date.now();
    await user.save();
    res.json({ message: "Perfil de usuario actualizado exitosamente", user });
  } catch (error) {
    console.error("Error actualizando perfil de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const disableUser   = async (req, res) => {
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

module.exports = {
  createOrUpdateUserProfile,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  disableUser
}
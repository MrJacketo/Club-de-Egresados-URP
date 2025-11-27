const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function createInspectorLaboral() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✓ Conectado a MongoDB");

    // Verificar si ya existe un inspector laboral
    const existingInspector = await User.findOne({ rol: "inspector_laboral" });

    if (existingInspector) {
      console.log("⚠ Ya existe un Inspector Laboral:");
      console.log("   Email:", existingInspector.email);
      console.log("   Nombre:", existingInspector.name);
      
      const readlineSync = require('readline-sync');
      const continuar = readlineSync.question('¿Deseas crear otro Inspector Laboral? (s/n): ');
      
      if (continuar.toLowerCase() !== 's') {
        console.log("Operación cancelada");
        process.exit(0);
      }
    }

    // Solicitar datos del inspector
    const readlineSync = require('readline-sync');
    
    const email = readlineSync.question('Ingresa el email del Inspector Laboral: ');
    const password = readlineSync.question('Ingresa la contraseña: ', {
      hideEchoBack: true
    });
    const name = readlineSync.question('Ingresa el nombre completo: ');

    // Validar email
    if (!email || !email.includes('@')) {
      throw new Error("Email inválido");
    }

    // Validar que no exista el email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese email");
    }

    // Crear inspector laboral
    const newInspector = new User({
      email,
      password,
      name,
      rol: "inspector_laboral",
      activo: true
    });

    await newInspector.save();

    console.log("\n✓ Inspector Laboral creado exitosamente:");
    console.log("   Email:", newInspector.email);
    console.log("   Nombre:", newInspector.name);
    console.log("   Rol:", newInspector.rol);
    console.log("\n   Ahora puede iniciar sesión en: http://localhost:5173/login");
    console.log("   Y acceder al panel de inspección en: http://localhost:5173/inspector-laboral");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error al crear Inspector Laboral:", error.message);
    process.exit(1);
  }
}

createInspectorLaboral();

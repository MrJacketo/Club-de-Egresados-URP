const express = require("express");
const router = express.Router();
const { createOrUpdatePerfil, getPerfil, getOptions } = require("../controllers/perfilController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// Route to create or update graduate profile
router.post("/perfil-egresado", verifyFirebaseToken, createOrUpdatePerfil);

// Route to get graduate profile
router.get("/get-perfil-egresado", verifyFirebaseToken, getPerfil);

// Route to get options for the form
router.get("/options", getOptions);

module.exports = router;
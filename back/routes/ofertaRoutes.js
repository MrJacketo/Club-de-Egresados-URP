const express = require("express");
const router = express.Router();
const { createOrUpdateOferta,
    getOferta,
    getOfertas,
    disableOferta,
    deleteOferta,
    getOptions } = require("../controllers/ofertaController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/oferta", createOrUpdateOferta);
router.get("/oferta/:id", verifyFirebaseToken, getOferta);
router.get("/ofertas", verifyFirebaseToken, getOfertas);
router.patch("/oferta/:id/deshabilitar", verifyFirebaseToken, disableOferta);
router.delete("/oferta/:id", verifyFirebaseToken, deleteOferta);
router.get("/options", getOptions);

module.exports = router;
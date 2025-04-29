const express = require("express");
const router = express.Router();
const { createOrUpdateOferta,
    getOferta,
    getOfertas,
    disableOferta,
    deleteOferta,
    getOptions } = require("../controllers/ofertaController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/oferta", verifyFirebaseToken, createOrUpdateOferta);
router.put("/oferta/:id", verifyFirebaseToken, createOrUpdateOferta);
router.get("/oferta/:id",verifyFirebaseToken, getOferta);
router.get("/ofertas",verifyFirebaseToken, getOfertas);
router.patch("/oferta/:id/deshabilitar",verifyFirebaseToken, disableOferta);
router.delete("/oferta/:id", verifyFirebaseToken, deleteOferta);
router.get("/oferta/options",verifyFirebaseToken, getOptions);

module.exports = router;
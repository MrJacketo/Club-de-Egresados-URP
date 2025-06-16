const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { createOrUpdateOferta,
    getOferta,
    getOfertas,
    disableOferta,
    deleteOferta,
    getOptions,
    postularOferta,
    getPostulantesDeOferta,
    getOfertasCreadasPorUsuario,
  verificarPostulacion } = require("../controllers/ofertaController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

router.post("/oferta", verifyFirebaseToken, createOrUpdateOferta);
//Postular a una oferta laboral
router.post("/oferta/:id/postular", verifyFirebaseToken, upload.single("cv"), (req, res) => {
  console.log("Ruta /oferta/:id/postular llamada con id:", req.params.id);
  postularOferta(req, res);
});

router.get('/postulaciones/:uid',verifyFirebaseToken,verificarPostulacion);

//Obtener postulantes de cada oferta
router.get("/oferta/:idOferta/postulantes", verifyFirebaseToken, getPostulantesDeOferta);
//Obtener ofertas creadas por un usuario
router.get("/ofertas/usuario/:uid", verifyFirebaseToken, getOfertasCreadasPorUsuario);

router.put("/oferta/:id", verifyFirebaseToken, createOrUpdateOferta);
router.get("/oferta/:id", verifyFirebaseToken, getOferta);
router.get("/ofertas", verifyFirebaseToken, getOfertas);
router.patch("/oferta/:id/deshabilitar", verifyFirebaseToken, disableOferta);
router.delete("/oferta/:id", verifyFirebaseToken, deleteOferta);
router.get("/oferta/options", verifyFirebaseToken, getOptions);

module.exports = router;
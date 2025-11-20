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
  verificarPostulacion,
  updateAptoPostulacion } = require("../controllers/ofertaController");
const verifyJWTToken = require("../middleware/verifyJWTToken");



router.post("/oferta", verifyJWTToken, createOrUpdateOferta);
//Postular a una oferta laboral
router.post("/oferta/:id/postular", verifyJWTToken, upload.single("cv"), postularOferta);

router.get('/postulaciones/:uid', verifyJWTToken, verificarPostulacion);

router.patch('/postulacion/:idPostulacion/apto', verifyJWTToken, updateAptoPostulacion);

//Obtener postulantes de cada oferta
router.get("/oferta/:idOferta/postulantes", verifyJWTToken, getPostulantesDeOferta);
//Obtener ofertas creadas por un usuario
router.get("/ofertas/usuario/:uid", verifyJWTToken, getOfertasCreadasPorUsuario);

router.put("/oferta/:id", verifyJWTToken, createOrUpdateOferta);
router.get("/oferta/:id", verifyJWTToken, getOferta);
router.get("/ofertas", verifyJWTToken, getOfertas);
router.patch("/oferta/:id/deshabilitar", verifyJWTToken, disableOferta);
router.delete("/oferta/:id", verifyJWTToken, deleteOferta);
router.get("/oferta/options", verifyJWTToken, getOptions);

module.exports = router;
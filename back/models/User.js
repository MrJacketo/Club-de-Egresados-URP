const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true },
  name: { type: String, default: "Anonymous" },
  profilePicture: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },

  //Ofertas laborales creadas por el usuario
  ofertasPublicadas: [{
    oferta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfertaLaboral",
      required: true,
    },
    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },
  }],

  //Ofertas postuladas por el usuario
  ofertasPostuladas: [{
    oferta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfertaLaboral",
      required: true,
    },
    fechaPostulacion: {
      type: Date,
      default: Date.now,
    },
  }
  ]
});

module.exports = mongoose.model("User", userSchema);
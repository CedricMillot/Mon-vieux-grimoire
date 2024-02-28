// Importation du module mongoose
const mongoose = require("mongoose");

// Création du schéma mongoose pour le modèle "Book"
const bookSchema = mongoose.Schema({
  // Champ userId de type String, obligatoire (required)
  userId: { type: String, required: true },

  // Champ title de type String, obligatoire (required)
  title: { type: String, required: true },

  // Champ author de type String, obligatoire (required)
  author: { type: String, required: true },

  // Champ imageUrl de type String, obligatoire (required)
  imageUrl: { type: String, required: true },

  // Champ year de type Number, obligatoire (required)
  year: { type: Number, required: true },

  // Champ genre de type String, obligatoire (required)
  genre: { type: String, required: true },

  // Champ ratings de type Array, contenant des objets avec userId (String) et grade (Number)
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5 },
    },
  ],

  // Champ averageRating de type Number, avec une valeur minimale de 0 et maximale de 5
  averageRating: { type: Number, min: 0, max: 5 },
});

// Exportation du modèle "Book" basé sur le schéma défini
module.exports = mongoose.model("Book", bookSchema);

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Expression régulière pour valider le format de l'email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Expression régulière pour valider le format du mot de passe
const passwordRegex = /^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).{6,}$/;

// Création du schéma mongoose pour représenter la structure d'un utilisateur
const userTemplate = mongoose.Schema({
  // Champ email de type String, requis, unique et avec validation personnalisée
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex, // Utilise la regex pour valider le format de l'email
  },

  // Champ password de type String, requis avec validation personnalisée
  password: {
    type: String,
    required: true,
    match: passwordRegex, // Utilise la regex pour valider le format du mot de passe
  },
});

// Utilise le plugin mongoose-unique-validator pour gérer la validation des champs uniques
userTemplate.plugin(uniqueValidator);

// Exporte le modèle "User" basé sur le schéma userTemplate
module.exports = mongoose.model("User", userTemplate);

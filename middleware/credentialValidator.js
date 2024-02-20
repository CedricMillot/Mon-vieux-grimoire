const emailValidator = require("@hapi/address");

module.exports = (req, res, next) => {
    
    // Vérification que l'email et le mot de passe sont bien complétés
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email ou mot de passe manquant" });  
    } 

    // Vérification de l'adresse email grâce à la bibliothèque @hapi/adress
    if (!emailValidator.isEmailValid(req.body.email)) {
        return res.status(400).json({ message : "Adresse email non valide" });
    }

    // Verification du mot de passe
    if (req.body.password.length < 6 || req.body.password === req.body.email ) {
        return res.status(400).json({ message: "Mot de passe non valide" });
    }

    next();
};

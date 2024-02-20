const express = require("express");
const userController = require("../controllers/userController");
const credentialValidator = require("../middleware/credentialValidator");

// Crée un router Express
const router = express.Router();

router.post("/signup", credentialValidator, userController.signup);
router.post("/login", userController.login);

module.exports = router;

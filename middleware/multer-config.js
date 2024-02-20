const multer = require('multer');

// Stocke les données dans le memoryStorage du multer
const storage = multer.memoryStorage();

// Configure le multer pour utiliser le storage et crée le middleware avec single
module.exports = multer({storage: storage}).single('image');
const express = require("express");
const bookController = require("../controllers/bookController");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const imageConverter = require("../middleware/imageConverter");

// Crée un router Express
const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/bestrating", bookController.getBestRating);
router.get("/:id", bookController.getOneBook);
router.post("/", auth, multer, imageConverter, bookController.createNewBook);
router.post("/:id/rating", auth, bookController.setBookRating);
router.put("/:id", auth, multer, imageConverter, bookController.modifyBook);
router.delete("/:id", auth, bookController.deleteBook);

module.exports = router;

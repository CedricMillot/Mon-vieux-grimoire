const fs = require("fs");
const Book = require("../models/book");

// Renvoie tous les livres de la BDD
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
};

// Fonction pour obtenir les trois livres les mieux notés
exports.getBestRatingBooks = (req, res, next) => {
  // Recherche tous les livres dans la base de données
  Book.find()
    //.sort Trie les résultats par ordre décroissant de la propriété averageRating
    .sort({ averageRating: "desc" })
    // Limite le nombre de résultats renvoyés à trois
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour obtenir un livre par son ID
exports.getOneBook = (req, res, next) => {
  // Utilise la méthode de Mongoose pour rechercher un livre dans la BDD en fonction de l'ID passé dans les paramètres de l'URL
  Book.findById(req.params.id)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Crée un nouveau livre dans la BDD
exports.createBook = (req, res, next) => {
  // Transforme au format JS le contenu de la clé "book"
  const bookObject = JSON.parse(req.body.book);
  // Suppression du userId pour utiliser le userId du Token à la place
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    // On rajoute le userId issu du Token
    userId: req.auth.userId,
    // Ajout de l'url de l'image
    imageUrl: req.file.externalURL,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "livre créé" }))
    .catch((error) => res.status(400).json({ error }));
};

// Ajoute une note à un livre selon son ID
exports.setBookRating = (req, res, next) => {
  // Vérifie que le userId associé au token est le même que celui de la requête
  if (req.body.userId === req.auth.userId) {
    // Cherche le livre associé à l'id du paramètre de l'URL
    Book.findById(req.params.id)
      .then((book) => {
        // Cherche si l'utilisateur n'a pas déjà noté le livre
        const foundRating = book.ratings.find(
          (rating) => rating.userId === req.body.userId
        );
        if (foundRating) {
          res.status(400).json({ message: "livre déjà noté" });
        } else {
          // Ajoute l'objet (user id et note) au tableau ratings du livre trouvé
          book.ratings.push({
            userId: req.auth.userId,
            grade: req.body.rating,
          });
          // Calcul la nouvelle moyenne
          let sum = 0;
          for (let oneBook of book.ratings) {
            sum += oneBook.grade || 0;
          }
          const averageRating = sum / book.ratings.length;
          // Met à jour la moyenne dans l'objet book
          book.averageRating = averageRating;
          // Met à jour la BDD en envoyant juste le tableau ratings
          Book.updateOne(
            { _id: req.params.id },
            { ratings: book.ratings, averageRating: book.averageRating }
          )
            .then(() => res.status(200).json(book))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(403).json({ message: "modification non autorisée" });
  }
};

// Modifie un livre de la BDD
exports.modifyBook = (req, res, next) => {
  // Récupère les données à mettre à jour (soit dans le req.body.book Parsé [si il y a un file] soit dans le req.body)
  const bookUpdated = req.body.book ? JSON.parse(req.body.book) : req.body;
  // Ajoute une imageUrl si une file est fournie par le multer
  if (req.file) {
    bookUpdated.imageUrl = req.file.externalURL;
  }

  // Vérifie que le userId associé au token est le même que celui de la requête
  if (bookUpdated.userId === req.auth.userId) {
    // Cherche un livre par son ID et le met à jour
    Book.findByIdAndUpdate(req.params.id, { ...bookUpdated })
      .then((oldBook) => {
        // Récupère l'ancien nom du fichier sur le serveur
        console.log(oldBook);
        // Supprime l'ancienne image du serveur
        if (req.file) {
          const oldFileName = oldBook.imageUrl.split("/images/")[1];
          fs.unlink(`images/${oldFileName}`, () => {
            res.status(200).json({ message: "livre modifié" });
          });
        } else {
          res.status(200).json({ message: "livre modifié" });
        }
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(403).json({ message: "modification non autorisée" });
  }
};

// Supprime un livre de la BDD
exports.deleteBook = (req, res, next) => {
  // Supprime le livre selon son Id et le renvoie en callback
  Book.findByIdAndDelete(req.params.id)
    .then((removedBook) => {
      // Conserve uniquement le nom du fichier
      const filename = removedBook.imageUrl.split("/images/")[1];
      // Supprime de manière asynchrone l'image du disque dur
      fs.unlink(`images/${filename}`, () => {
        res.status(200).json({ message: "Livre supprimé" });
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

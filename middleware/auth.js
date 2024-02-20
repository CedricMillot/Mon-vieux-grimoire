const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        // Récupère le token dans le authorization après le bearer 
       const token = req.headers.authorization.split(' ')[1];
       // Vérifie que le token récupéré a bien été signé avec ma clef
       const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
       // Récupère les données à la clef userId du decodedToken
       const userId = decodedToken.userId;
       // Rajoute une clef auth dans la requête
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
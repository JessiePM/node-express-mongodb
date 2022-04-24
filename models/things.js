const mongoose = require('mongoose');

// creation d'un schéma de données qui contient les champs souhaités pour chaque Thing, 
//indique leur type ainsi que leur caractère (obligatoire ou non). 
//Pour cela, on utilise la méthode Schema mise à disposition par Mongoose. 
//Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose ;

//ensuite, exportons ce schéma en tant que modèle Mongoose appelé « Thing », 
//le rendant par là même disponible pour notre application Express.
const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Thing = require('./models/things');

mongoose.connect('mongodb+srv://adminj:MotestdB@cluster0.akyq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// pour extraire le corps JSON d'une requête POST
// prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
app.use(express.json());

//permet au server du frontend (port 4200) de communiquer avec le server 3000
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Veillez à :
// soit modifier la méthode  use  en  get  pour le middleware des requêtes GET ;
// soit placer la route POST au-dessus du middleware pour les requêtes GET, car la logique GET interceptera actuellement toutes les requêtes envoyées à votre endpoint /api/stuff , étant donné qu'on ne lui a pas indiqué de verbe spécifique. Placer la route POST au-dessus interceptera les requêtes POST, en les empêchant d'atteindre le middleware GET.


//créez une instance de modèle Thing en lui passant un objet JavaScript 
//contenant toutes les informations requises du corps de requête analysé 
//(en ayant supprimé en amont le faux_id envoyé par le front-end).
//L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
// méthode save() qui enregistre simplement votre Thing dans la base de données.
//La base de données MongoDB est fractionnée en collections : 
//le nom de la collection est défini par défaut sur le pluriel du nom du modèle. Ici, ce sera Things
app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

// la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
// deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre ;
// la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête
  app.get('/api/stuff/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  });

  //requêtes PUT
  //updateOne() : mettre à jour le Thing qui correspond à l'objet passé en premier argument. 
  //paramètre id passé dans la demande, et le remplaçons par le Thing passé comme second argument.
  //new -> crée par défaut un champ_id . Utiliser ce mot-clé = une erreur, car champ immuable. 
  //Par conséquent,le paramètre id de la requête pour configurer notre Thing avec le même _id qu'avant.
  app.put('/api/stuff/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });

//requêtes DELETE
  app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });

//  implémenter notre route GET afin qu'elle renvoie tous les Things dans la base de données
//find() renvoe un tableau contenant tous les Things dans notre base de données
// si vous ajoutez un Thing , il doit s'afficher immédiatement sur votre page d'articles en vente
app.use('/api/stuff', (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  });

/*app.use('/api/stuff', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });*/

module.exports = app;
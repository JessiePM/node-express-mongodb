const express = require('express');

const app = express();

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

app.post('/api/stuff', (req, res, next) => {
console.log(req.body);
res.status(201).json({
    message: 'Objet créé !'
});
});

app.use('/api/stuff', (req, res, next) => {
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
  });

module.exports = app;
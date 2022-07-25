const express = require('express');

const app = express ();

const Thing = require('./models/thing');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mathieu:DBadmin@cluster0.fniqqay.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



/* Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON.
Middleware simple mis à disposition par le framework Express. */
app.use (express.json());


/* CORS - Cross Origin Resource Sharing : Systeme de sécurité qui, par défaut bloque les appels HTTP entre des serveurs différents,
ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles
Middleware - Headers permettent : accéder à l'API depuis n'importe quelle origine ('*') +
Ajouter les headers mentionnées aux requêtes envoyées vers l'API (Origin, X-Requested-With etc.) */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* Interception des requêtes de type POST - Création de resource */
app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
});

/* Methode updateOne - Requêtes de type PUT - Modification de l'objet */
app.put('/api/stuff/:id', (req, res, next) => {
Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});


/* Methode deleteeOne - Requêtes de type DELETE - Suppression de l'objet */
app.delete('/api/stuff/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
});


/* Methode findOne - Requêtes de type GET - Interception de l'objet */
app.get('/api/stuff/:id', (req, res, next) => {
Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

/* Route pour laquelle on enregistre l'élément middleware. URL demandée par l'application front-end
Middleware créant un groupe d'article avec le schéma spécifique requis par le front-end.
Article envoyé sous la forme de données JSON, avec un code 200 pour une demande réussie. */
/* Interception de toutes les requêtes avec la méthode GET - Création de resource */
app.get('/api/stuff', (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
});

module.exports = app;
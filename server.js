const express = require('express');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares pour les formulaires et les fichiers statiques
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route test pour valider la récupération depuis MySQL
app.get('/test-db', function(req, res) {
  db.query('SELECT COUNT(*) AS totalOffres FROM offres', function(err, results) {
    if (err) {
      return res.status(500).send('Erreur BDD : ' + err.message);
    }
    res.send('Connexion OK ! Nombre d\'offres en base : ' + results[0].totalOffres);
  });
});

app.listen(PORT, function() {
  console.log('Serveur démarré sur http://localhost:' + PORT);
});

const offreRepo = require('./repositories/offreRepository');

app.get('/test-repo', function(req, res) {
  offreRepo.findAll({}, function(err, offres) {
    if (err) {
      return res.status(500).send('Erreur Repository : ' + err.message);
    }
    res.json({
      total: offres.length,
      premiereOffre: offres[0]
    });
  });
});
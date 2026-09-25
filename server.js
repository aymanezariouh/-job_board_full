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
const express = require('express');
const path = require('path');
require('dotenv').config();

const offreRepo = require('./repositories/offreRepository');
const metaRepo = require('./repositories/metaRepository');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration EJS et middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Page d'accueil : Liste des offres avec filtres
app.get('/', function(req, res) {
  const filters = {
    search: req.query.search || '',
    ville: req.query.ville || '',
    type_contrat: req.query.type_contrat || '',
    technologie: req.query.technologie || '',
    tri: req.query.tri || 'desc'
  };

  // Récupérer d'abord les métadonnées pour les sélecteurs
  metaRepo.getDistinctVilles(function(errVilles, villes) {
    if (errVilles) return res.status(500).send(errVilles.message);

    metaRepo.getAllTechnologies(function(errTechs, technologies) {
      if (errTechs) return res.status(500).send(errTechs.message);

      // Récupérer les offres filtrées
      offreRepo.findAll(filters, function(errOffres, offres) {
        if (errOffres) return res.status(500).send(errOffres.message);

        res.render('index', {
          offres: offres,
          villes: villes,
          technologies: technologies,
          filters: filters
        });
      });
    });
  });
});

// 2. Page détail d'une offre
app.get('/offres/:id', function(req, res) {
  const id = req.params.id;

  offreRepo.findById(id, function(err, offre) {
    if (err) return res.status(500).send(err.message);
    if (!offre) return res.status(404).send('Offre non trouvée');

    res.render('detail', { offre: offre });
  });
});

app.listen(PORT, function() {
  console.log('Serveur démarré sur http://localhost:' + PORT);
});
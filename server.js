require('dotenv').config();
const path = require('path');
const express = require('express');

const db = require('./config/db');
const metaRepo = require('./repositories/metaRepository');
const offreRepo = require('./repositories/offreRepository');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  const filters = {
    search: req.query.search || '',
    ville: req.query.ville || '',
    type_contrat: req.query.type_contrat || '',
    technologie: req.query.technologie || '',
    tri: req.query.tri || 'desc'
  };

  metaRepo.getDistinctVilles(function(errVilles, villes) {
    if (errVilles) return res.status(500).send(errVilles.message);

    metaRepo.getAllTechnologies(function(errTechs, technologies) {
      if (errTechs) return res.status(500).send(errTechs.message);

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

app.get('/offres/:id', function(req, res) {
  const id = req.params.id;

  offreRepo.findById(id, function(err, offre) {
    if (err) return res.status(500).send(err.message);
    if (!offre) return res.status(404).send('Offre non trouvée');

    res.render('detail', { offre: offre });
  });
});

app.get('/suivi', function(req, res) {
  offreRepo.findAll({}, function(err, offres) {
    if (err) return res.status(500).send(err.message);
    res.render('suivi', { offres: offres });
  });
});

app.get('/admin/offres', function(req, res) {
  offreRepo.findAll({}, function(err, offres) {
    if (err) return res.status(500).send(err.message);
    res.render('admin/index', { offres: offres });
  });
});

app.get('/admin/offres/nouveau', function(req, res) {
  metaRepo.getAllEntreprises(function(errEnt, entreprises) {
    if (errEnt) return res.status(500).send(errEnt.message);

    metaRepo.getAllTechnologies(function(errTech, technologies) {
      if (errTech) return res.status(500).send(errTech.message);

      res.render('admin/form', {
        isEdit: false,
        offre: null,
        entreprises: entreprises,
        technologies: technologies,
        selectedTechs: []
      });
    });
  });
});

app.post('/admin/offres', function(req, res) {
  const offreData = {
    titre: req.body.titre,
    description_courte: req.body.description_courte,
    description_detaillee: req.body.description_detaillee,
    ville: req.body.ville,
    type_contrat: req.body.type_contrat,
    profil_recherche: req.body.profil_recherche,
    lien_candidature: req.body.lien_candidature,
    entreprise_id: Number(req.body.entreprise_id)
  };

  let technologies = req.body.technologies || [];
  if (!Array.isArray(technologies)) {
    technologies = [technologies];
  }

  offreRepo.create(offreData, technologies, function(err) {
    if (err) return res.status(500).send(err.message);
    res.redirect('/admin/offres');
  });
});

app.get('/admin/offres/:id/edit', function(req, res) {
  const id = req.params.id;

  offreRepo.findById(id, function(errOffre, offre) {
    if (errOffre) return res.status(500).send(errOffre.message);
    if (!offre) return res.status(404).send('Offre non trouvée');

    metaRepo.getAllEntreprises(function(errEnt, entreprises) {
      if (errEnt) return res.status(500).send(errEnt.message);

      metaRepo.getAllTechnologies(function(errTech, technologies) {
        if (errTech) return res.status(500).send(errTech.message);

        offreRepo.getTechnologiesForOffre(id, function(errAssoc, selectedTechs) {
          if (errAssoc) return res.status(500).send(errAssoc.message);

          res.render('admin/form', {
            isEdit: true,
            offre: offre,
            entreprises: entreprises,
            technologies: technologies,
            selectedTechs: selectedTechs
          });
        });
      });
    });
  });
});

app.post('/admin/offres/:id/edit', function(req, res) {
  const id = req.params.id;
  const offreData = {
    titre: req.body.titre,
    description_courte: req.body.description_courte,
    description_detaillee: req.body.description_detaillee,
    ville: req.body.ville,
    type_contrat: req.body.type_contrat,
    profil_recherche: req.body.profil_recherche,
    lien_candidature: req.body.lien_candidature,
    entreprise_id: Number(req.body.entreprise_id)
  };

  let technologies = req.body.technologies || [];
  if (!Array.isArray(technologies)) {
    technologies = [technologies];
  }

  offreRepo.update(id, offreData, technologies, function(err) {
    if (err) return res.status(500).send(err.message);
    res.redirect('/admin/offres');
  });
});

app.post('/admin/offres/:id/delete', function(req, res) {
  const id = req.params.id;

  offreRepo.delete(id, function(err) {
    if (err) return res.status(500).send(err.message);
    res.redirect('/admin/offres');
  });
});

app.get('/test-db', function(req, res) {
  db.query('SELECT COUNT(*) AS totalOffres FROM offres', function(err, results) {
    if (err) {
      return res.status(500).send('Erreur BDD : ' + err.message);
    }
    res.send('Connexion OK ! Nombre d\'offres en base : ' + results[0].totalOffres);
  });
});

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

app.listen(PORT, function() {
  console.log('Serveur démarré sur http://localhost:' + PORT);
});
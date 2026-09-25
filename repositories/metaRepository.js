const db = require('../config/db');

const metaRepository = {
  // Récupérer toutes les technologies pour les filtres et les formulaires
  getAllTechnologies: function(callback) {
    db.query('SELECT * FROM technologies ORDER BY nom ASC', function(err, results) {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Récupérer les villes distinctes présentes dans les offres
  getDistinctVilles: function(callback) {
    db.query('SELECT DISTINCT ville FROM offres ORDER BY ville ASC', function(err, results) {
      if (err) return callback(err, null);
      callback(null, results.map(function(r) { return r.ville; }));
    });
  },

  // Récupérer toutes les entreprises pour le back-office
  getAllEntreprises: function(callback) {
    db.query('SELECT id, nom FROM entreprises ORDER BY nom ASC', function(err, results) {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }
};

module.exports = metaRepository;
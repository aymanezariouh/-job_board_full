const db = require('../config/db');

const offreRepository = {
  // 1. Lister et filtrer les offres
  findAll: function(filters, callback) {
    let sql = `
      SELECT 
        o.id,
        o.titre,
        o.description_courte,
        o.ville,
        o.type_contrat,
        o.date_publication,
        e.nom AS entreprise_nom,
        GROUP_CONCAT(t.nom SEPARATOR ', ') AS technologies
      FROM offres o
      JOIN entreprises e ON o.entreprise_id = e.id
      LEFT JOIN offre_technologie ot ON o.id = ot.offre_id
      LEFT JOIN technologies t ON ot.technologie_id = t.id
      WHERE 1=1
    `;

    const params = [];

    // Filtre par ville
    if (filters.ville && filters.ville.trim() !== '') {
      sql += ' AND o.ville = ?';
      params.push(filters.ville.trim());
    }

    // Filtre par type de contrat (Stage / Alternance)
    if (filters.type_contrat && filters.type_contrat.trim() !== '') {
      sql += ' AND o.type_contrat = ?';
      params.push(filters.type_contrat.trim());
    }

    // Filtre textuel par mot-clé (titre, description ou nom d'entreprise)
    if (filters.search && filters.search.trim() !== '') {
      sql += ' AND (o.titre LIKE ? OR o.description_courte LIKE ? OR e.nom LIKE ?)';
      const keyword = '%' + filters.search.trim() + '%';
      params.push(keyword, keyword, keyword);
    }

    sql += ' GROUP BY o.id';

    // Filtre par technologie (appliqué après regroupement)
    if (filters.technologie && filters.technologie.trim() !== '') {
      sql += ' HAVING FIND_IN_SET(?, GROUP_CONCAT(t.nom)) > 0';
      params.push(filters.technologie.trim());
    }

    // Tri par date
    if (filters.tri === 'asc') {
      sql += ' ORDER BY o.date_publication ASC';
    } else {
      sql += ' ORDER BY o.date_publication DESC';
    }

    db.query(sql, params, function(err, results) {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // 2. Récupérer le détail complet d'une offre
  findById: function(id, callback) {
    const sql = `
      SELECT 
        o.*,
        e.nom AS entreprise_nom,
        e.site_web AS entreprise_site,
        e.description_courte AS entreprise_description,
        GROUP_CONCAT(t.nom SEPARATOR ', ') AS technologies
      FROM offres o
      JOIN entreprises e ON o.entreprise_id = e.id
      LEFT JOIN offre_technologie ot ON o.id = ot.offre_id
      LEFT JOIN technologies t ON ot.technologie_id = t.id
      WHERE o.id = ?
      GROUP BY o.id
    `;

    db.query(sql, [id], function(err, results) {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  }
};

module.exports = offreRepository;

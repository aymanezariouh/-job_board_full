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

    if (filters.ville && filters.ville.trim() !== '') {
      sql += ' AND o.ville = ?';
      params.push(filters.ville.trim());
    }

    if (filters.type_contrat && filters.type_contrat.trim() !== '') {
      sql += ' AND o.type_contrat = ?';
      params.push(filters.type_contrat.trim());
    }

    if (filters.search && filters.search.trim() !== '') {
      sql += ' AND (o.titre LIKE ? OR o.description_courte LIKE ? OR e.nom LIKE ?)';
      const keyword = '%' + filters.search.trim() + '%';
      params.push(keyword, keyword, keyword);
    }

    sql += ' GROUP BY o.id';

    if (filters.technologie && filters.technologie.trim() !== '') {
      sql += ' HAVING FIND_IN_SET(?, GROUP_CONCAT(t.nom)) > 0';
      params.push(filters.technologie.trim());
    }

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

  // 2. Trouver une offre par son ID
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
  },

  // 3. Récupérer les IDs des technologies associées à une offre
  getTechnologiesForOffre: function(offreId, callback) {
    const sql = 'SELECT technologie_id FROM offre_technologie WHERE offre_id = ?';
    db.query(sql, [offreId], function(err, results) {
      if (err) return callback(err, null);
      const techIds = results.map(function(r) { return r.technologie_id; });
      callback(null, techIds);
    });
  },

  // 4. Créer une offre avec ses technologies
  create: function(offreData, technologieIds, callback) {
    const sql = `
      INSERT INTO offres 
      (titre, description_courte, description_detaillee, ville, type_contrat, profil_recherche, lien_candidature, entreprise_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      offreData.titre,
      offreData.description_courte,
      offreData.description_detaillee,
      offreData.ville,
      offreData.type_contrat,
      offreData.profil_recherche,
      offreData.lien_candidature,
      offreData.entreprise_id
    ];

    db.query(sql, params, function(err, result) {
      if (err) return callback(err, null);

      const newOffreId = result.insertId;

      if (!technologieIds || technologieIds.length === 0) {
        return callback(null, newOffreId);
      }

      // Préparer les paires [offre_id, technologie_id]
      const liaisons = technologieIds.map(function(techId) {
        return [newOffreId, Number(techId)];
      });

      const sqlAssoc = 'INSERT INTO offre_technologie (offre_id, technologie_id) VALUES ?';
      db.query(sqlAssoc, [liaisons], function(errAssoc) {
        if (errAssoc) return callback(errAssoc, null);
        callback(null, newOffreId);
      });
    });
  },

  // 5. Modifier une offre et synchroniser ses technologies
  update: function(id, offreData, technologieIds, callback) {
    const sql = `
      UPDATE offres SET 
        titre = ?,
        description_courte = ?,
        description_detaillee = ?,
        ville = ?,
        type_contrat = ?,
        profil_recherche = ?,
        lien_candidature = ?,
        entreprise_id = ?
      WHERE id = ?
    `;

    const params = [
      offreData.titre,
      offreData.description_courte,
      offreData.description_detaillee,
      offreData.ville,
      offreData.type_contrat,
      offreData.profil_recherche,
      offreData.lien_candidature,
      offreData.entreprise_id,
      id
    ];

    db.query(sql, params, function(err) {
      if (err) return callback(err);

      // Réinitialiser puis réinsérer les associations
      db.query('DELETE FROM offre_technologie WHERE offre_id = ?', [id], function(errDel) {
        if (errDel) return callback(errDel);

        if (!technologieIds || technologieIds.length === 0) {
          return callback(null);
        }

        const liaisons = technologieIds.map(function(techId) {
          return [id, Number(techId)];
        });

        const sqlAssoc = 'INSERT INTO offre_technologie (offre_id, technologie_id) VALUES ?';
        db.query(sqlAssoc, [liaisons], function(errAssoc) {
          if (errAssoc) return callback(errAssoc);
          callback(null);
        });
      });
    });
  },

  // 6. Supprimer une offre
  delete: function(id, callback) {
    // La suppression en cascade (ON DELETE CASCADE) gère automatiquement la table offre_technologie
    db.query('DELETE FROM offres WHERE id = ?', [id], function(err, result) {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};

module.exports = offreRepository;
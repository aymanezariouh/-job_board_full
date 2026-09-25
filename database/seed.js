const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_board_db',
  port: process.env.DB_PORT || 3306
});

connection.connect(function(err) {
  if (err) {
    console.error('Erreur de connexion MySQL :', err);
    process.exit(1);
  }
  console.log('Connecté à MySQL pour le seeding.');
  viderTables();
});

// Étape 1 : Vider les tables
function viderTables() {
  connection.query('DELETE FROM offre_technologie', function(err) {
    if (err) throw err;
    connection.query('DELETE FROM offres', function(err) {
      if (err) throw err;
      connection.query('DELETE FROM technologies', function(err) {
        if (err) throw err;
        connection.query('DELETE FROM entreprises', function(err) {
          if (err) throw err;
          console.log('Tables nettoyées.');
          insererEntreprises();
        });
      });
    });
  });
}

// Étape 2 : Insérer 5 entreprises
const entreprises = [
  ['TechSolutions', 'Casablanca', 'ESN spécialisée cloud et web.', 'https://techsolutions.ma'],
  ['InnoWeb', 'Rabat', 'Startup créatrice de solutions SaaS.', 'https://innoweb.ma'],
  ['DevStudio', 'Tanger', 'Agence de développement web et mobile.', 'https://devstudio.com'],
  ['Atlas Data', 'Marrakech', 'Entreprise experte en valorisation de données.', 'https://atlasdata.ma'],
  ['NéoCode', 'Fès', 'Studio spécialisé en transformation digitale.', 'https://neocode.ma']
];

function insererEntreprises() {
  const sql = 'INSERT INTO entreprises (nom, ville, description_courte, site_web) VALUES ?';
  connection.query(sql, [entreprises], function(err, result) {
    if (err) throw err;
    console.log('Entreprises insérées : ' + result.affectedRows);
    insererTechnologies();
  });
}

// Étape 3 : Insérer 8 technologies
const technologies = [
  ['JavaScript', 'Frontend/Backend'],
  ['Node.js', 'Backend'],
  ['React', 'Frontend'],
  ['Express', 'Backend'],
  ['MySQL', 'Base de données'],
  ['MongoDB', 'Base de données'],
  ['TypeScript', 'Langage'],
  ['Docker', 'DevOps']
];

function insererTechnologies() {
  const sql = 'INSERT INTO technologies (nom, categorie) VALUES ?';
  connection.query(sql, [technologies], function(err, result) {
    if (err) throw err;
    console.log('Technologies insérées : ' + result.affectedRows);
    insererOffres();
  });
}

// Étape 4 : Insérer 12 offres
function insererOffres() {
  connection.query('SELECT id FROM entreprises ORDER BY id ASC', function(err, rowsEntreprises) {
    if (err) throw err;

    const e1 = rowsEntreprises[0].id;
    const e2 = rowsEntreprises[1].id;
    const e3 = rowsEntreprises[2].id;
    const e4 = rowsEntreprises[3].id;
    const e5 = rowsEntreprises[4].id;

    const offres = [
      ['Développeur Node.js Junior', 'Conception et maintenance d\'APIs internes.', 'Participer au développement du backend de nos plateformes avec Express et MySQL.', 'Casablanca', 'Stage', 'Bac+3/5 en informatique, débutant motivé.', 'recrutement@techsolutions.ma', e1],
      ['Développeur Full-Stack MERN', 'Renfort sur nos projets SaaS clients.', 'Développement de nouvelles features sur React et Node.js sous méthodologie agile.', 'Rabat', 'Alternance', 'Expérience préalable avec Express et MongoDB/MySQL.', 'rh@innoweb.ma', e2],
      ['Intégrateur Web / Frontend', 'Intégration d\'interfaces responsives modernes.', 'Création de templates réutilisables et composants UI interactifs.', 'Tanger', 'Stage', 'Maîtrise de HTML, CSS et JavaScript moderne.', 'jobs@devstudio.com', e3],
      ['Assistant Data Engineer', 'Pipeline de données et optimisation SQL.', 'Écriture de scripts d\'extraction et optimisation de requêtes SQL.', 'Marrakech', 'Alternance', 'Bonnes bases en SQL et Python ou Node.js.', 'contact@atlasdata.ma', e4],
      ['Développeur Backend Express', 'Refonte d\'architecture micro-services.', 'Conception d\'endpoints et sécurisation de bases de données.', 'Fès', 'Stage', 'Étudiant en école d\'ingénieur ou autodidacte passionné.', 'stage@neocode.ma', e5],
      ['Développeur JavaScript / React', 'Développement de dashboards clients.', 'Implémentation de vues complexes avec gestion d\'états.', 'Casablanca', 'Alternance', 'Bonnes connaissances de React et TypeScript.', 'recrutement@techsolutions.ma', e1],
      ['Développeur Backend Junior', 'Maintenance évolutive d\'APIs.', 'Écriture de tests et documentation de routes avec Express.', 'Rabat', 'Stage', 'Connaissances solides en Node.js.', 'rh@innoweb.ma', e2],
      ['Développeur Web Full-Stack', 'Projet de digitalisation e-commerce.', 'Prise en charge de modules de commande et back-office.', 'Tanger', 'Alternance', 'Profil polyvalent Frontend et Backend.', 'jobs@devstudio.com', e3],
      ['Stagiaire DBA / SQL', 'Audit et nettoyage de bases relationnelles.', 'Modélisation et optimisation des index MySQL.', 'Marrakech', 'Stage', 'Curieux et rigoureux sur les modèles relationnels.', 'contact@atlasdata.ma', e4],
      ['Développeur API REST', 'Création d\'une passerelle de services.', 'Documentation et tests des points de terminaison REST.', 'Fès', 'Alternance', 'À l\'aise avec Express et les requêtes SQL préparées.', 'stage@neocode.ma', e5],
      ['Développeur DevOps & Node.js', 'Conteneurisation et déploiement applicatif.', 'Mise en place de conteneurs Docker pour les applications Node.', 'Casablanca', 'Alternance', 'Notions en Docker et environnements Linux.', 'recrutement@techsolutions.ma', e1],
      ['Stagiaire Développeur Frontend', 'Amélioration de l\'expérience utilisateur.', 'Transformation de maquettes Figma en pages interactives.', 'Rabat', 'Stage', 'Connaissance de JavaScript et Tailwind/Bootstrap.', 'rh@innoweb.ma', e2]
    ];

    const sql = 'INSERT INTO offres (titre, description_courte, description_detaillee, ville, type_contrat, profil_recherche, lien_candidature, entreprise_id) VALUES ?';
    connection.query(sql, [offres], function(err, result) {
      if (err) throw err;
      console.log('Offres insérées : ' + result.affectedRows);
      lierOffresTechnologies();
    });
  });
}

// Étape 5 : Lier les offres aux technologies
function lierOffresTechnologies() {
  connection.query('SELECT id FROM offres ORDER BY id ASC', function(err, rowsOffres) {
    if (err) throw err;
    connection.query('SELECT id FROM technologies ORDER BY id ASC', function(err, rowsTechs) {
      if (err) throw err;

      // rowsTechs: [0]=JS, [1]=Node, [2]=React, [3]=Express, [4]=MySQL, [5]=Mongo, [6]=TS, [7]=Docker
      const t = rowsTechs.map(function(item) { return item.id; });
      const o = rowsOffres.map(function(item) { return item.id; });

      const liaisons = [
        [o[0], t[1]], [o[0], t[3]], [o[0], t[4]], // Offre 1: Node, Express, MySQL
        [o[1], t[0]], [o[1], t[1]], [o[1], t[2]], // Offre 2: JS, Node, React
        [o[2], t[0]],                             // Offre 3: JS
        [o[3], t[4]], [o[3], t[0]],               // Offre 4: MySQL, JS
        [o[4], t[1]], [o[4], t[3]],               // Offre 5: Node, Express
        [o[5], t[0]], [o[5], t[2]], [o[5], t[6]], // Offre 6: JS, React, TS
        [o[6], t[1]], [o[6], t[3]],               // Offre 7: Node, Express
        [o[7], t[0]], [o[7], t[1]], [o[7], t[4]], // Offre 8: JS, Node, MySQL
        [o[8], t[4]],                             // Offre 9: MySQL
        [o[9], t[1]], [o[9], t[3]], [o[9], t[4]], // Offre 10: Node, Express, MySQL
        [o[10], t[1]], [o[10], t[7]],             // Offre 11: Node, Docker
        [o[11], t[0]]                             // Offre 12: JS
      ];

      const sql = 'INSERT INTO offre_technologie (offre_id, technologie_id) VALUES ?';
      connection.query(sql, [liaisons], function(err, result) {
        if (err) throw err;
        console.log('Associations offres <-> technologies insérées : ' + result.affectedRows);
        console.log('Seeding terminé avec succès.');
        connection.end();
      });
    });
  });
}
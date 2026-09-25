const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

// Connexion avec l'option multipleStatements activée pour exécuter le schema.sql
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_board_db',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error('Erreur de connexion MySQL :', err);
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Exécution du schéma SQL...');
  connection.query(schemaSql, function(err) {
    if (err) {
      console.error('Erreur lors de la réinitialisation du schéma :', err);
      process.exit(1);
    }
    console.log('Schéma réinitialisé avec succès.');
    connection.end(function() {
      // Exécute ensuite le seeder
      console.log('Lancement du seeder...');
      require('./seed.js');
    });
  });
});

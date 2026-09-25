const mysql = require('mysql2');
require('dotenv').config();

// Création d'un pool de connexions réutilisable
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_board_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test rapide de la connexion au démarrage
pool.getConnection(function(err, connection) {
  if (err) {
    console.error('Erreur de connexion au pool MySQL :', err.message);
  } else {
    console.log('Connecté au pool MySQL avec succès.');
    connection.release();
  }
});

module.exports = pool;
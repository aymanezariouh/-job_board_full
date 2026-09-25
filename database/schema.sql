-- Création et sélection de la base
CREATE DATABASE IF NOT EXISTS job_board_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE job_board_db;

DROP TABLE IF EXISTS offre_technologie;
DROP TABLE IF EXISTS offres;
DROP TABLE IF EXISTS technologies;
DROP TABLE IF EXISTS entreprises;

-- 1. Table Entreprise
CREATE TABLE entreprises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    description_courte TEXT,
    site_web VARCHAR(255)
);

-- 2. Table Offre
CREATE TABLE offres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description_courte TEXT NOT NULL,
    description_detaillee TEXT NOT NULL,
    ville VARCHAR(100) NOT NULL,
    type_contrat ENUM('Stage', 'Alternance') NOT NULL,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profil_recherche TEXT,
    lien_candidature VARCHAR(255) NOT NULL,
    entreprise_id INT NOT NULL,
    CONSTRAINT fk_offre_entreprise 
        FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) 
        ON DELETE CASCADE
);

-- 3. Table Technologie
CREATE TABLE technologies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    categorie VARCHAR(100)
);

-- 4. Table d'association Offre_Technologie (Many-to-Many)
CREATE TABLE offre_technologie (
    offre_id INT NOT NULL,
    technologie_id INT NOT NULL,
    PRIMARY KEY (offre_id, technologie_id),
    CONSTRAINT fk_ot_offre 
        FOREIGN KEY (offre_id) REFERENCES offres(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_ot_technologie 
        FOREIGN KEY (technologie_id) REFERENCES technologies(id) 
        ON DELETE CASCADE
);
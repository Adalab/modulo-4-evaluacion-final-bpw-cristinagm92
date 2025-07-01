CREATE SCHEMA IF NOT EXISTS simpsoms;
USE simpsoms;

CREATE TABLE personajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  ocupacion VARCHAR(100),
  descripcion TEXT
);

CREATE TABLE capitulos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  numero_episodio INT,
  temporada INT,
  fecha_emision DATE,
  sinopsis TEXT
);

CREATE TABLE frases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  texto TEXT NOT NULL,
  marca_tiempo VARCHAR(10),
  descripcion TEXT,
  personaje_id INT NOT NULL,
  capitulo_id INT,
  FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
  FOREIGN KEY (capitulo_id) REFERENCES capitulos(id) ON DELETE CASCADE
);

CREATE TABLE capitulos_personajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personaje_id INT NOT NULL,
  capitulo_id INT NOT NULL,
  FOREIGN KEY (personaje_id) REFERENCES personajes(id) ON DELETE CASCADE,
  FOREIGN KEY (capitulo_id) REFERENCES capitulos(id) ON DELETE CASCADE
);

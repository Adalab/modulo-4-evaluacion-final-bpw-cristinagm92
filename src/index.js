const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Conexión a la base de datos
async function getConnection() {
  const datosConexion = {
    host: process.env.HOST ,
    port: process.env.PORT ,
    user: process.env.USER ,
    password: process.env.PASSWORD ,
    database: process.env.DATABASE ,
  };

  const conexion = await mysql.createConnection(datosConexion);
  await conexion.connect();
  return conexion;
}

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Bienvenida a la API de simpsom!");
});

// POST /frases - Insertar una nueva frase
app.post("/frases", async (req, res) => {
  const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body;

  if (!texto || !personaje_id) {
    return res.status(400).json({
      success: false,
      message: "El texto y el ID del personaje son obligatorios",
    });
  }

  try {
    const conn = await getConnection();
    const query = `
      INSERT INTO frases (texto, marca_tiempo, descripcion, personaje_id, capitulo_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await conn.execute(query, [
      texto,
      marca_tiempo || null,
      descripcion || null,
      personaje_id,
      capitulo_id || null,
    ]);
    await conn.end();

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al insertar frase" });
  }
});

// GET /frases - Listar todas las frases
app.get("/frases", async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(`
      SELECT 
        f.id,
        f.texto,
        f.marca_tiempo,
        f.descripcion,
        p.id AS personaje_id,
        CONCAT(p.nombre, ' ', p.apellido) AS personaje,
        c.id AS capitulo_id,
        c.titulo AS capitulo_titulo
      FROM frases f
      JOIN personajes p ON f.personaje_id = p.id
      LEFT JOIN capitulos c ON f.capitulo_id = c.id
    `);
    await conn.end();

    res.status(200).json({ success: true, frases: rows });
  } catch (err) {
    console.error("Error al obtener frases:", err);
    res.status(500).json({ success: false, message: "Error al obtener frases" });
  }
});

// GET /frases/:id - Obtener una frase específica
app.get("/frases/:id", async (req, res) => {
  const fraseId = req.params.id;

  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `
      SELECT 
        f.id,
        f.texto,
        f.marca_tiempo,
        f.descripcion,
        p.id AS personaje_id,
        CONCAT(p.nombre, ' ', p.apellido) AS personaje,
        c.id AS capitulo_id,
        c.titulo AS capitulo_titulo
      FROM frases f
      JOIN personajes p ON f.personaje_id = p.id
      LEFT JOIN capitulos c ON f.capitulo_id = c.id
      WHERE f.id = ?
      `,
      [fraseId]
    );
    await conn.end();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Frase no encontrada" });
    }

    res.status(200).json({ success: true, frase: rows[0] });
  } catch (err) {
    console.error("Error al obtener la frase:", err);
    res.status(500).json({ success: false, message: "Error al obtener la frase" });
  }
});

// PUT /frases/:id - Actualizar una frase existente
app.put("/frases/:id", async (req, res) => {
  const fraseId = req.params.id;
  const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } = req.body;

  if (!texto || !personaje_id) {
    return res.status(400).json({
      success: false,
      message: "El texto y el ID del personaje son obligatorios",
    });
  }

  try {
    const conn = await getConnection();

    const [frase] = await conn.execute("SELECT id FROM frases WHERE id = ?", [fraseId]);

    if (frase.length === 0) {
      await conn.end();
      return res.status(404).json({ success: false, message: "Frase no encontrada" });
    }

    await conn.execute(
      `
      UPDATE frases
      SET texto = ?, marca_tiempo = ?, descripcion = ?, personaje_id = ?, capitulo_id = ?
      WHERE id = ?
      `,
      [texto, marca_tiempo || null, descripcion || null, personaje_id, capitulo_id || null, fraseId]
    );

    await conn.end();

    res.status(200).json({
      success: true,
      message: "Frase actualizada correctamente",
    });
  } catch (err) {
    console.error("Error al actualizar la frase:", err);
    res.status(500).json({ success: false, message: "Error al actualizar la frase" });
  }
});

// DELETE /frases/:id - Eliminar una frase existente
app.delete("/frases/:id", async (req, res) => {
  const fraseId = req.params.id;

  try {
    const conn = await getConnection();

    const [resultado] = await conn.execute("SELECT id FROM frases WHERE id = ?", [fraseId]);

    if (resultado.length === 0) {
      await conn.end();
      return res.status(404).json({
        success: false,
        message: "Frase no encontrada",
      });
    }

    await conn.execute("DELETE FROM frases WHERE id = ?", [fraseId]);
    await conn.end();

    res.status(200).json({
      success: true,
      message: `Frase con ID ${fraseId} eliminada correctamente.`,
    });
  } catch (err) {
    console.error("Error al eliminar frase:", err);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la frase",
    });
  }
});

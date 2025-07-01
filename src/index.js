const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function getConnection() {
  const datosConexion = {
    host: "192.168.1.135",
    port: "3306",
    user: "root",
    password: "password",
    database: "simpsoms",
  };

  const conexion = await mysql.createConnection(datosConexion);
  await conexion.connect();
  return conexion;
}

app.get("/", (req, res) => {
  res.send("¡Bienvenida a la API de simpsom!");
});

app.post("/frases", async (req, res) => {
  const { texto, marca_tiempo, descripcion, personaje_id, capitulo_id } =
    req.body;

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
    console.log(err)
    
    res
      .status(500)
      .json({ success: false, message: "Error al insertar frase" });
  }
});

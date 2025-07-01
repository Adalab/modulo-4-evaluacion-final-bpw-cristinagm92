const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
app.use( cors() );
app.use( express.json() );
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

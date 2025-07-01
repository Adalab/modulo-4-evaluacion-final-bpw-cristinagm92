# 📺 Proyecto Base de Datos: Los Simpson

Este proyecto consiste en una base de datos MySQL modelada a partir del universo de *Los Simpson*, con endpoints funcionales para gestionar personajes, capítulos, frases y sus relaciones. Se ha trabajado en Visual Studio Code utilizando conexión directa a la base de datos.

---

## 📁 Estructura del Proyecto

- `/sql/` → Contiene el archivo con el esquema de la base de datos.
- `/src/` → Código backend con los endpoints .(express)
  .
- `README.md` → Este archivo :)

---

## 🧱 Esquema de la Base de Datos

- `personajes`: Información básica sobre los personajes.
- `capitulos`: Detalles por episodio (título, sinopsis, temporada...).
- `frases`: Frases icónicas de los personajes, con marca de tiempo y capítulo.
- `capitulos_personajes`: Tabla relacional entre personajes y capítulos.

---

## 🔌 Conexión y Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/los-simpson-bd.git

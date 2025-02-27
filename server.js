require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    application_name: "crud_cockroachdb"
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Verificar conexión a la base de datos al inicio
pool.connect()
    .then(client => {
        console.log("✅ Conexión a la base de datos establecida");
        client.release();
    })
    .catch(err => console.error("❌ Error al conectar a la base de datos:", err.message));

// Rutas API
app.get('/db-info', async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database() AS dbname, current_user AS user;");
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en /db-info:", error);
        res.status(500).json({ error: "Error obteniendo información de la BD" });
    }
});

app.post('/crear', async (req, res) => {
    const { id, balance } = req.body;
    try {
        const result = await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2) RETURNING *;", [id, balance]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en /crear:", error);
        res.status(500).json({ error: "Error creando el registro" });
    }
});

app.get('/leer', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM accounts;");
        res.json(result.rows);
    } catch (error) {
        console.error("Error en /leer:", error);
        res.status(500).json({ error: "Error obteniendo registros" });
    }
});

app.put('/actualizar', async (req, res) => {
    const { id, balance } = req.body;
    try {
        const result = await pool.query("UPDATE accounts SET balance = $1 WHERE id = $2 RETURNING *;", [balance, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en /actualizar:", error);
        res.status(500).json({ error: "Error actualizando el registro" });
    }
});

app.delete('/eliminar', async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query("DELETE FROM accounts WHERE id = $1 RETURNING *;", [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en /eliminar:", error);
        res.status(500).json({ error: "Error eliminando el registro" });
    }
});

// Ruta para servir el frontend correctamente en Vercel
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor (modo local) o exportar la app para Vercel
if (process.env.NODE_ENV !== 'vercel') {
    app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
}

module.exports = app; // Necesario para Vercel

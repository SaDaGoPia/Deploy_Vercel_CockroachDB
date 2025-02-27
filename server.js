require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

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
app.use(express.static('public'));

// Obtener información de la base de datos
app.get('/db-info', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT current_database() AS dbname, current_user AS user;");
        client.release();
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo registro
app.post('/crear', async (req, res) => {
    const { id, balance } = req.body;
    try {
        const result = await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2) RETURNING *;", [id, balance]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leer registros
app.get('/leer', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM accounts;");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un registro
app.put('/actualizar', async (req, res) => {
    const { id, balance } = req.body;
    try {
        const result = await pool.query("UPDATE accounts SET balance = $1 WHERE id = $2 RETURNING *;", [balance, id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un registro
app.delete('/eliminar', async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query("DELETE FROM accounts WHERE id = $1 RETURNING *;", [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

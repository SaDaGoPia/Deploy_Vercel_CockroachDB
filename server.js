require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./src/config/database');
const accountRoutes = require('./src/routes/accounts');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Verificar conexión a la base de datos al inicio
pool.connect()
    .then(client => {
        console.log("✅ Conexión a NeonSQL establecida");
        client.release();
    })
    .catch(err => console.error("❌ Error al conectar a NeonSQL:", err.message));

// Rutas API
app.use('/api', accountRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Ruta para servir el frontend correctamente en Vercel
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de manejo de errores (debe ser el último)
app.use(errorHandler);

// Iniciar el servidor (modo local) o exportar la app para Vercel
if (process.env.NODE_ENV !== 'vercel') {
    app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
}

module.exports = app; // Necesario para Vercel

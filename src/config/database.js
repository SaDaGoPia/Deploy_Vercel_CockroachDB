require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    application_name: "crud_neonsql",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Event listeners para debugging
pool.on('connect', () => {
    console.log('📦 Nueva conexión al pool');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool:', err);
});

module.exports = pool;

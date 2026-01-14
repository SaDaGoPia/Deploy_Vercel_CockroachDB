require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    application_name: "crud_neonsql"
});

async function initializeDatabase() {
    const client = await pool.connect();
    try {
        console.log("🔍 Validando conexión a NeonSQL...");
        
        // Prueba de conexión
        const connectionTest = await client.query("SELECT current_database() AS dbname, current_user AS user, version() AS version;");
        console.log("✅ Conexión establecida:");
        console.log(`   Base de datos: ${connectionTest.rows[0].dbname}`);
        console.log(`   Usuario: ${connectionTest.rows[0].user}`);
        console.log(`   PostgreSQL versión: ${connectionTest.rows[0].version.split(',')[0]}`);

        // Crear tabla si no existe
        console.log("\n📊 Creando tabla 'accounts' si no existe...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id UUID PRIMARY KEY,
                balance INT8 NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Tabla 'accounts' lista");

        // Crear índice para mejorar rendimiento
        console.log("\n⚙️  Creando índices...");
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON accounts(created_at);
        `);
        console.log("✅ Índices creados");

        console.log("\n🎉 Base de datos inicializada correctamente\n");
        
    } catch (error) {
        console.error("❌ Error durante la inicialización:", error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            pool.end();
            process.exit(0);
        })
        .catch(err => {
            pool.end();
            process.exit(1);
        });
}

module.exports = { initializeDatabase, pool };

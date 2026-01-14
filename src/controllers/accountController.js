const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { validateAccountData } = require('../utils/validators');
const { ValidationError, DatabaseError, NotFoundError } = require('../utils/errors');

/**
 * Obtener información de la conexión a la BD
 */
const getConnectionInfo = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT 
                current_database() AS dbname, 
                current_user AS user,
                version() AS version
        `);
        res.json({
            success: true,
            data: {
                dbname: result.rows[0].dbname,
                user: result.rows[0].user,
                version: result.rows[0].version.split(',')[0]
            }
        });
    } catch (error) {
        next(new DatabaseError('Error obteniendo información de la conexión'));
    }
};

/**
 * Crear una nueva cuenta
 */
const createAccount = async (req, res, next) => {
    try {
        let { id, balance } = req.body;
        
        // Generar UUID si no se proporciona
        if (!id) {
            id = uuidv4();
        }
        
        // Validar datos
        const validation = validateAccountData(id, balance);
        if (!validation.valid) {
            throw new ValidationError(validation.errors.join(', '));
        }
        
        // Insertar en la BD
        const result = await pool.query(
            `INSERT INTO accounts (id, balance) 
             VALUES ($1, $2) 
             RETURNING id, balance, created_at, updated_at`,
            [id, balance]
        );
        
        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            next(error);
        } else if (error.code === '23505') {
            next(new ValidationError('La cuenta con este ID ya existe'));
        } else {
            next(new DatabaseError('Error creando la cuenta'));
        }
    }
};

/**
 * Obtener todas las cuentas
 */
const getAllAccounts = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT id, balance, created_at, updated_at 
             FROM accounts 
             ORDER BY created_at DESC`
        );
        
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(new DatabaseError('Error obteniendo las cuentas'));
    }
};

/**
 * Obtener una cuenta por ID
 */
const getAccountById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `SELECT id, balance, created_at, updated_at 
             FROM accounts 
             WHERE id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new NotFoundError('Cuenta no encontrada');
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            next(error);
        } else {
            next(new DatabaseError('Error obteniendo la cuenta'));
        }
    }
};

/**
 * Actualizar una cuenta
 */
const updateAccount = async (req, res, next) => {
    try {
        const { id, balance } = req.body;
        
        // Validar datos
        const validation = validateAccountData(id, balance);
        if (!validation.valid) {
            throw new ValidationError(validation.errors.join(', '));
        }
        
        // Actualizar en la BD
        const result = await pool.query(
            `UPDATE accounts 
             SET balance = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, balance, created_at, updated_at`,
            [balance, id]
        );
        
        if (result.rows.length === 0) {
            throw new NotFoundError('Cuenta no encontrada');
        }
        
        res.json({
            success: true,
            message: 'Cuenta actualizada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            next(error);
        } else {
            next(new DatabaseError('Error actualizando la cuenta'));
        }
    }
};

/**
 * Eliminar una cuenta
 */
const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            throw new ValidationError('El ID es requerido');
        }
        
        // Eliminar de la BD
        const result = await pool.query(
            `DELETE FROM accounts 
             WHERE id = $1
             RETURNING id, balance, created_at, updated_at`,
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new NotFoundError('Cuenta no encontrada');
        }
        
        res.json({
            success: true,
            message: 'Cuenta eliminada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            next(error);
        } else {
            next(new DatabaseError('Error eliminando la cuenta'));
        }
    }
};

module.exports = {
    getConnectionInfo,
    createAccount,
    getAllAccounts,
    getAccountById,
    updateAccount,
    deleteAccount
};

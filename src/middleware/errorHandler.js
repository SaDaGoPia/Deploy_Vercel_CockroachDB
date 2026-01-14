const { ValidationError, DatabaseError, NotFoundError } = require('../utils/errors');

/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.name} - ${err.message}`);
    
    // Errores personalizados
    if (err instanceof ValidationError) {
        return res.status(err.status).json({
            error: 'Error de validación',
            message: err.message,
            status: err.status
        });
    }
    
    if (err instanceof NotFoundError) {
        return res.status(err.status).json({
            error: 'No encontrado',
            message: err.message,
            status: err.status
        });
    }
    
    if (err instanceof DatabaseError) {
        return res.status(err.status).json({
            error: 'Error en la base de datos',
            message: err.message,
            status: err.status
        });
    }
    
    // Errores de base de datos sin capturar
    if (err.code && err.code.startsWith('P')) {
        const statusCode = err.code === 'P0001' ? 400 : 500;
        return res.status(statusCode).json({
            error: 'Error en la base de datos',
            message: 'Ocurrió un error al procesar la solicitud',
            status: statusCode
        });
    }
    
    // Error genérico
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado',
        status: 500
    });
};

module.exports = errorHandler;

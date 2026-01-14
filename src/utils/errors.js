/**
 * Clase personalizada para errores de validación
 */
class ValidationError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        this.name = 'ValidationError';
    }
}

/**
 * Clase personalizada para errores de base de datos
 */
class DatabaseError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = 'DatabaseError';
    }
}

/**
 * Clase personalizada para errores no encontrados
 */
class NotFoundError extends Error {
    constructor(message = 'Recurso no encontrado', status = 404) {
        super(message);
        this.status = status;
        this.name = 'NotFoundError';
    }
}

module.exports = {
    ValidationError,
    DatabaseError,
    NotFoundError
};

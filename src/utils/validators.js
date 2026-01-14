const { validate: isValidUUID } = require('uuid');

/**
 * Valida que sea un UUID válido
 */
const validateUUID = (id) => {
    try {
        return isValidUUID(id);
    } catch {
        return false;
    }
};

/**
 * Valida que sea un número entero válido
 */
const validateBalance = (balance) => {
    const num = Number(balance);
    return !isNaN(num) && Number.isInteger(num) && num >= -9223372036854775808 && num <= 9223372036854775807;
};

/**
 * Valida que el ID sea UUID y balance sea un número válido
 */
const validateAccountData = (id, balance) => {
    const errors = [];
    
    if (!id || !validateUUID(id)) {
        errors.push('El ID debe ser un UUID válido');
    }
    
    if (balance === undefined || balance === null) {
        errors.push('El balance es requerido');
    } else if (!validateBalance(balance)) {
        errors.push('El balance debe ser un número entero válido');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateUUID,
    validateBalance,
    validateAccountData
};

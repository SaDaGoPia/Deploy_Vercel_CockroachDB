const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Rutas de cuentas
router.get('/db-info', accountController.getConnectionInfo);
router.post('/crear', accountController.createAccount);
router.get('/leer', accountController.getAllAccounts);
router.get('/leer/:id', accountController.getAccountById);
router.put('/actualizar', accountController.updateAccount);
router.delete('/eliminar', accountController.deleteAccount);

module.exports = router;

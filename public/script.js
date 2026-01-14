// Constantes y configuración
const API_BASE = '/api';
const OUTPUT_ELEMENT = document.getElementById('output');
const TOAST_ELEMENT = document.getElementById('toast');

/**
 * Mostrar notificación toast
 */
function showToast(message, type = 'info', duration = 3000) {
    TOAST_ELEMENT.textContent = message;
    TOAST_ELEMENT.className = `toast show ${type}`;
    
    setTimeout(() => {
        TOAST_ELEMENT.classList.remove('show');
    }, duration);
}

/**
 * Mostrar respuesta formateada en JSON
 */
function displayOutput(data) {
    OUTPUT_ELEMENT.textContent = JSON.stringify(data, null, 2);
}

/**
 * Manejar errores de respuesta
 */
async function handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || data.error || 'Error desconocido',
            data
        };
    }
    
    return data;
}

/**
 * Obtener información de la conexión a la BD
 */
async function obtenerInfoDB() {
    try {
        const response = await fetch(`${API_BASE}/db-info`);
        const data = await handleResponse(response);
        
        document.getElementById("DBname").textContent = data.data.dbname;
        document.getElementById("DBname").classList.remove('loading');
        
        document.getElementById("UserName").textContent = data.data.user;
        document.getElementById("UserName").classList.remove('loading');
        
        document.getElementById("status").textContent = '✅ Conectado';
        document.getElementById("status").style.color = '#28a745';
        document.getElementById("status").classList.remove('loading');
        
        showToast('Conexión a la base de datos establecida', 'success');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("status").textContent = '❌ Error de conexión';
        document.getElementById("status").style.color = '#dc3545';
        document.getElementById("status").classList.remove('loading');
        showToast(`Error: ${error.message}`, 'error');
    }
}

/**
 * Crear una nueva cuenta
 */
async function crearRegistro() {
    try {
        const id = document.getElementById('createId').value.trim() || null;
        const balance = document.getElementById('createBalance').value.trim();
        
        if (!balance) {
            showToast('El balance es requerido', 'error');
            return;
        }
        
        const response = await fetch(`${API_BASE}/crear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: id || undefined, 
                balance: parseInt(balance) 
            })
        });
        
        const data = await handleResponse(response);
        displayOutput(data);
        
        document.getElementById('createId').value = '';
        document.getElementById('createBalance').value = '';
        
        showToast('✅ Cuenta creada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Obtener todas las cuentas
 */
async function leerRegistros() {
    try {
        const response = await fetch(`${API_BASE}/leer`);
        const data = await handleResponse(response);
        
        displayOutput(data);
        showToast(`✅ ${data.count} cuenta(s) obtenida(s)`, 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Buscar una cuenta por ID
 */
async function buscarPorId() {
    try {
        const id = document.getElementById('searchId').value.trim();
        
        if (!id) {
            showToast('Por favor ingresa un ID para buscar', 'error');
            return;
        }
        
        const response = await fetch(`${API_BASE}/leer/${id}`);
        const data = await handleResponse(response);
        
        displayOutput(data);
        showToast('✅ Cuenta encontrada', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Actualizar una cuenta
 */
async function actualizarRegistro() {
    try {
        const id = document.getElementById('updateId').value.trim();
        const balance = document.getElementById('updateBalance').value.trim();
        
        if (!id) {
            showToast('El ID es requerido', 'error');
            return;
        }
        if (!balance) {
            showToast('El balance es requerido', 'error');
            return;
        }
        
        const response = await fetch(`${API_BASE}/actualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id, 
                balance: parseInt(balance) 
            })
        });
        
        const data = await handleResponse(response);
        displayOutput(data);
        
        document.getElementById('updateId').value = '';
        document.getElementById('updateBalance').value = '';
        
        showToast('✅ Cuenta actualizada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Eliminar una cuenta
 */
async function eliminarRegistro() {
    try {
        const id = document.getElementById('deleteId').value.trim();
        
        if (!id) {
            showToast('El ID es requerido', 'error');
            return;
        }
        
        if (!confirm(`¿Estás seguro de que deseas eliminar la cuenta con ID: ${id}?`)) {
            return;
        }
        
        const response = await fetch(`${API_BASE}/eliminar`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const data = await handleResponse(response);
        displayOutput(data);
        
        document.getElementById('deleteId').value = '';
        
        showToast('✅ Cuenta eliminada exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        displayOutput({ error: error.message, status: error.status });
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Inicializar la aplicación
 */
window.addEventListener('DOMContentLoaded', () => {
    obtenerInfoDB();
});

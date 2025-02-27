const API_URL = "http://localhost:3000";

// 📌 Obtener información de conexión
async function obtenerInfoConexion() {
    try {
        const response = await fetch(`${API_URL}/info`);
        const data = await response.json();
        document.getElementById("DBname").innerText = data.db;
        document.getElementById("UserName").innerText = data.user;
        document.getElementById("connState").innerText = "Conectado";
    } catch (error) {
        document.getElementById("connState").innerText = "Error de conexión";
        console.error(error);
    }
}

// 📌 Crear cuenta
async function crearCuenta() {
    const balance = prompt("Ingrese el saldo inicial:");
    const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: parseInt(balance) })
    });
    const data = await response.json();
    alert(data.message);
}

// 📌 Leer cuentas
async function leerCuentas() {
    const response = await fetch(`${API_URL}/read`);
    const cuentas = await response.json();
    alert(JSON.stringify(cuentas, null, 2));
}

// 📌 Actualizar cuenta
async function actualizarCuenta() {
    const id = prompt("Ingrese el ID de la cuenta:");
    const balance = prompt("Ingrese el nuevo saldo:");
    const response = await fetch(`${API_URL}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, balance: parseInt(balance) })
    });
    const data = await response.json();
    alert(data.message);
}

// 📌 Eliminar cuenta
async function eliminarCuenta() {
    const id = prompt("Ingrese el ID de la cuenta a eliminar:");
    const response = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    const data = await response.json();
    alert(data.message);
}

// 📌 Cargar información al inicio
document.addEventListener("DOMContentLoaded", obtenerInfoConexion);
async function obtenerInfoDB() {
    const response = await fetch('/db-info');
    const data = await response.json();
    document.getElementById("DBname").textContent = data.dbname;
    document.getElementById("UserName").textContent = data.user;
}

async function crearRegistro() {
    const id = prompt("Ingrese el ID:");
    const balance = prompt("Ingrese el balance:");
    const response = await fetch('/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, balance })
    });
    document.getElementById("output").textContent = await response.json();
}

async function leerRegistros() {
    const response = await fetch('/leer');
    document.getElementById("output").textContent = JSON.stringify(await response.json(), null, 2);
}

async function actualizarRegistro() {
    const id = prompt("Ingrese el ID:");
    const balance = prompt("Ingrese el nuevo balance:");
    const response = await fetch('/actualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, balance })
    });
    document.getElementById("output").textContent = await response.json();
}

async function eliminarRegistro() {
    const id = prompt("Ingrese el ID:");
    const response = await fetch('/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    document.getElementById("output").textContent = await response.json();
}

window.onload = obtenerInfoDB;

const CLAVE_STORAGE = "mascotas";
let idEditando = null;
const form = document.getElementById("formMascota");
const tabla = document.getElementById("tablaMascotas");
const totalMascotas = document.getElementById("totalMascotas");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

function obtenerMascotas() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("No se pudieron leer las mascotas guardadas:", error);
        return [];
    }
}

function guardarMascotas(mascotas) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(mascotas));
        return true;
    } catch (error) {
        console.error("No se pudieron guardar las mascotas:", error);
        alert("No se pudieron guardar los datos en el navegador.");
        return false;
    }
}

function generarId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function crearCelda(valor) {
    const celda = document.createElement("td");
    celda.textContent = valor;
    return celda;
}

function actualizarTabla() {
    const mascotas = obtenerMascotas();
    tabla.replaceChildren();
    if (mascotas.length === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda("Todavía no hay mascotas registradas.");
        celda.colSpan = 7;
        celda.className = "text-center text-muted";
        fila.appendChild(celda);
        tabla.appendChild(fila);
    } else {
        mascotas.forEach((mascota) => {
            const fila = document.createElement("tr");
            fila.appendChild(crearCelda(mascota.idMascota));
            fila.appendChild(crearCelda(mascota.nombreMascota));
            fila.appendChild(crearCelda(mascota.nombreDuenio));
            fila.appendChild(crearCelda(mascota.color));
            fila.appendChild(crearCelda(mascota.edad));
            fila.appendChild(crearCelda(`${mascota.peso} kg`));
            const celdaAcciones = document.createElement("td");
            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.className = "btn btn-warning btn-sm me-1";
            btnEditar.dataset.accion = "editar";
            btnEditar.dataset.id = mascota.idMascota;
            btnEditar.textContent = "Editar";
            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.className = "btn btn-danger btn-sm";
            btnEliminar.dataset.accion = "eliminar";
            btnEliminar.dataset.id = mascota.idMascota;
            btnEliminar.textContent = "Eliminar";
            celdaAcciones.append(btnEditar, btnEliminar);
            fila.appendChild(celdaAcciones);
            tabla.appendChild(fila);
        });
    }
    totalMascotas.textContent = mascotas.length;
}

function editarMascota(id) {
    const mascota = obtenerMascotas().find((item) => item.idMascota === id);
    if (!mascota) {
        alert("No se encontró la mascota seleccionada.");
        return;
    }
    idEditando = id;
    document.getElementById("nombreMascota").value = mascota.nombreMascota;
    document.getElementById("nombreDuenio").value = mascota.nombreDuenio;
    document.getElementById("color").value = mascota.color;
    document.getElementById("edad").value = mascota.edad;
    document.getElementById("peso").value = mascota.peso;
    btnGuardar.textContent = "Actualizar";
    btnCancelar.hidden = false;
    document.getElementById("nombreMascota").focus();
}

function eliminarMascota(id) {
    const mascotas = obtenerMascotas();
    const mascota = mascotas.find((item) => item.idMascota === id);
    if (!mascota) return;
    if (!confirm(`¿Querés eliminar a ${mascota.nombreMascota}?`)) return;
    if (!guardarMascotas(mascotas.filter((item) => item.idMascota !== id))) return;
    if (idEditando === id) form.reset();
    actualizarTabla();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const edad = Number(document.getElementById("edad").value);
    const peso = Number(document.getElementById("peso").value);
    if (!Number.isInteger(edad) || edad < 0 || !Number.isFinite(peso) || peso < 0) {
        alert("Ingresá una edad entera y un peso válido.");
        return;
    }
    const mascotas = obtenerMascotas();
    const datosFormulario = {
        nombreMascota: document.getElementById("nombreMascota").value.trim(),
        nombreDuenio: document.getElementById("nombreDuenio").value.trim(),
        color: document.getElementById("color").value.trim(),
        edad,
        peso
    };
    if (idEditando) {
        const indice = mascotas.findIndex((item) => item.idMascota === idEditando);
        if (indice === -1) {
            alert("No se encontró la mascota que querés actualizar.");
            form.reset();
            return;
        }
        mascotas[indice] = { ...mascotas[indice], ...datosFormulario };
    } else {
        mascotas.push({ idMascota: generarId(), ...datosFormulario });
    }
    if (!guardarMascotas(mascotas)) return;
    form.reset();
    actualizarTabla();
});

form.addEventListener("reset", () => {
    idEditando = null;
    btnGuardar.textContent = "Guardar";
    btnCancelar.hidden = true;
});

btnCancelar.addEventListener("click", () => form.reset());

tabla.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-accion]");
    if (!boton) return;
    if (boton.dataset.accion === "editar") editarMascota(boton.dataset.id);
    if (boton.dataset.accion === "eliminar") eliminarMascota(boton.dataset.id);
});

actualizarTabla();

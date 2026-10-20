"use strict";

const CLAVE_TURNOS = "turnos";

const formulario = document.querySelector("#formularioTurno");
const mensaje = document.querySelector("#mensajeTurno");
const listaTurnos = document.querySelector("#listaTurnos");
const sinTurnos = document.querySelector("#sinTurnos");
const totalTurnos = document.querySelector("#totalTurnos");
const botonGuardar = document.querySelector("#botonGuardar");
const botonCancelar = document.querySelector("#botonCancelar");
const fechaInput = document.querySelector("#fecha");

function obtenerTurnos() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || [];
    } catch {
        return [];
    }
}

function guardarTurnos(turnos) {
    localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
}

function crearId() {
    return window.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mostrarMensaje(texto, tipo) {
    mensaje.replaceChildren();

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.setAttribute("role", "alert");
    alerta.append(document.createTextNode(texto));

    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.className = "btn-close";
    cerrar.dataset.bsDismiss = "alert";
    cerrar.setAttribute("aria-label", "Cerrar");
    alerta.append(cerrar);

    mensaje.append(alerta);
}

function formatearFecha(fecha, hora) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio} - ${hora}`;
}

function agregarCelda(fila, texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    fila.append(celda);
}

function renderizarTurnos() {
    const turnos = obtenerTurnos().sort((a, b) =>
        `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
    );

    listaTurnos.replaceChildren();
    totalTurnos.textContent = turnos.length;
    sinTurnos.classList.toggle("d-none", turnos.length > 0);

    turnos.forEach((turno) => {
        const fila = document.createElement("tr");

        agregarCelda(fila, turno.mascota);
        agregarCelda(fila, turno.responsable);
        agregarCelda(fila, turno.telefono);
        agregarCelda(fila, formatearFecha(turno.fecha, turno.hora));
        agregarCelda(fila, turno.motivo);

        const acciones = document.createElement("td");
        acciones.className = "text-nowrap";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "btn btn-sm btn-outline-primary me-1";
        editar.textContent = "Editar";
        editar.dataset.accion = "editar";
        editar.dataset.id = turno.id;

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "btn btn-sm btn-outline-danger";
        eliminar.textContent = "Eliminar";
        eliminar.dataset.accion = "eliminar";
        eliminar.dataset.id = turno.id;

        acciones.append(editar, eliminar);
        fila.append(acciones);
        listaTurnos.append(fila);
    });
}

function limpiarFormulario() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.querySelector("#idTurno").value = "";
    botonGuardar.textContent = "Guardar turno";
    botonCancelar.classList.add("d-none");
}

function editarTurno(id) {
    const turno = obtenerTurnos().find((item) => item.id === id);

    if (!turno) return;

    document.querySelector("#idTurno").value = turno.id;
    document.querySelector("#mascota").value = turno.mascota;
    document.querySelector("#responsable").value = turno.responsable;
    document.querySelector("#telefono").value = turno.telefono;
    document.querySelector("#fecha").value = turno.fecha;
    document.querySelector("#hora").value = turno.hora;
    document.querySelector("#motivo").value = turno.motivo;

    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.classList.remove("d-none");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarTurno(id) {
    const turno = obtenerTurnos().find((item) => item.id === id);

    if (!turno || !window.confirm(`¿Eliminar el turno de ${turno.mascota}?`)) {
        return;
    }

    guardarTurnos(obtenerTurnos().filter((item) => item.id !== id));
    renderizarTurnos();
    mostrarMensaje("El turno fue eliminado.", "success");
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    formulario.classList.add("was-validated");

    if (!formulario.checkValidity()) return;

    const turno = {
        id: document.querySelector("#idTurno").value || crearId(),
        mascota: document.querySelector("#mascota").value.trim(),
        responsable: document.querySelector("#responsable").value.trim(),
        telefono: document.querySelector("#telefono").value.trim(),
        fecha: fechaInput.value,
        hora: document.querySelector("#hora").value,
        motivo: document.querySelector("#motivo").value.trim()
    };

    const turnos = obtenerTurnos();
    const indice = turnos.findIndex((item) => item.id === turno.id);
    const editando = indice !== -1;

    if (editando) {
        turnos[indice] = turno;
    } else {
        turnos.push(turno);
    }

    guardarTurnos(turnos);
    limpiarFormulario();
    renderizarTurnos();

    mostrarMensaje(
        editando ? "El turno fue actualizado." : "El turno fue registrado.",
        "success"
    );
});

listaTurnos.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) return;

    if (boton.dataset.accion === "editar") {
        editarTurno(boton.dataset.id);
    }

    if (boton.dataset.accion === "eliminar") {
        eliminarTurno(boton.dataset.id);
    }
});

botonCancelar.addEventListener("click", limpiarFormulario);

fechaInput.min = new Date().toLocaleDateString("en-CA");

renderizarTurnos();

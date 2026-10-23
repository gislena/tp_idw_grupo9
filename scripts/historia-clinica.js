"use strict";

const CLAVE_HISTORIAS = "historiasClinicas";

const formulario = document.querySelector("#formularioHistoria");
const mensaje = document.querySelector("#mensajeHistoria");
const listaHistorias = document.querySelector("#listaHistorias");
const sinHistorias = document.querySelector("#sinHistorias");
const totalHistorias = document.querySelector("#totalHistorias");
const botonGuardar = document.querySelector("#botonGuardar");
const botonCancelar = document.querySelector("#botonCancelar");
const fechaInput = document.querySelector("#fecha");

function obtenerHistorias() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_HISTORIAS)) || [];
    } catch {
        return [];
    }
}

function guardarHistorias(historias) {
    localStorage.setItem(CLAVE_HISTORIAS, JSON.stringify(historias));
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

function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

function agregarCelda(fila, texto) {
    const celda = document.createElement("td");
    celda.textContent = texto || "-";
    fila.append(celda);
}

function renderizarHistorias() {
    const historias = obtenerHistorias().sort((a, b) =>
        b.fecha.localeCompare(a.fecha)
    );

    listaHistorias.replaceChildren();
    totalHistorias.textContent = historias.length;
    sinHistorias.classList.toggle("d-none", historias.length > 0);

    historias.forEach((historia) => {
        const fila = document.createElement("tr");

        agregarCelda(fila, historia.mascota);
        agregarCelda(fila, historia.responsable);
        agregarCelda(fila, formatearFecha(historia.fecha));
        agregarCelda(fila, historia.veterinario);
        agregarCelda(fila, historia.diagnostico);
        agregarCelda(fila, historia.tratamiento);
        agregarCelda(fila, historia.observaciones);

        const acciones = document.createElement("td");
        acciones.className = "text-nowrap";

        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "btn btn-sm btn-outline-primary me-1";
        editar.textContent = "Editar";
        editar.dataset.accion = "editar";
        editar.dataset.id = historia.id;

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "btn btn-sm btn-outline-danger";
        eliminar.textContent = "Eliminar";
        eliminar.dataset.accion = "eliminar";
        eliminar.dataset.id = historia.id;

        acciones.append(editar, eliminar);
        fila.append(acciones);
        listaHistorias.append(fila);
    });
}

function limpiarFormulario() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.querySelector("#idHistoria").value = "";
    botonGuardar.textContent = "Guardar registro";
    botonCancelar.classList.add("d-none");
}

function editarHistoria(id) {
    const historia = obtenerHistorias().find((item) => item.id === id);

    if (!historia) return;

    document.querySelector("#idHistoria").value = historia.id;
    document.querySelector("#mascota").value = historia.mascota;
    document.querySelector("#responsable").value = historia.responsable;
    document.querySelector("#fecha").value = historia.fecha;
    document.querySelector("#veterinario").value = historia.veterinario;
    document.querySelector("#diagnostico").value = historia.diagnostico;
    document.querySelector("#tratamiento").value = historia.tratamiento;
    document.querySelector("#observaciones").value = historia.observaciones;

    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.classList.remove("d-none");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarHistoria(id) {
    const historia = obtenerHistorias().find((item) => item.id === id);

    if (!historia || !window.confirm(`¿Eliminar la historia clínica de ${historia.mascota}?`)) {
        return;
    }

    guardarHistorias(obtenerHistorias().filter((item) => item.id !== id));
    renderizarHistorias();
    mostrarMensaje("El registro clínico fue eliminado.", "success");
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    formulario.classList.add("was-validated");

    if (!formulario.checkValidity()) return;

    const historia = {
        id: document.querySelector("#idHistoria").value || crearId(),
        mascota: document.querySelector("#mascota").value.trim(),
        responsable: document.querySelector("#responsable").value.trim(),
        fecha: fechaInput.value,
        veterinario: document.querySelector("#veterinario").value.trim(),
        diagnostico: document.querySelector("#diagnostico").value.trim(),
        tratamiento: document.querySelector("#tratamiento").value.trim(),
        observaciones: document.querySelector("#observaciones").value.trim()
    };

    const historias = obtenerHistorias();
    const indice = historias.findIndex((item) => item.id === historia.id);
    const editando = indice !== -1;

    if (editando) {
        historias[indice] = historia;
    } else {
        historias.push(historia);
    }

    guardarHistorias(historias);
    limpiarFormulario();
    renderizarHistorias();

    mostrarMensaje(
        editando ? "El registro clínico fue actualizado." : "El registro clínico fue guardado.",
        "success"
    );
});

listaHistorias.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) return;

    if (boton.dataset.accion === "editar") {
        editarHistoria(boton.dataset.id);
    }

    if (boton.dataset.accion === "eliminar") {
        eliminarHistoria(boton.dataset.id);
    }
});

botonCancelar.addEventListener("click", limpiarFormulario);

fechaInput.max = new Date().toLocaleDateString("en-CA");

renderizarHistorias();

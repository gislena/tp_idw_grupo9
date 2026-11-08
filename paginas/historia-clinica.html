"use strict";

const CLAVE_HISTORIAS = "historiasClinicas";
const CLAVE_MASCOTAS = "mascotas";

const formulario = document.querySelector("#formularioHistoria");
const mensaje = document.querySelector("#mensajeHistoria");
const listaHistorias = document.querySelector("#listaHistorias");
const sinHistorias = document.querySelector("#sinHistorias");
const totalHistorias = document.querySelector("#totalHistorias");
const botonGuardar = document.querySelector("#botonGuardar");
const botonCancelar = document.querySelector("#botonCancelar");
const mascotaInput = document.querySelector("#mascota");
const fechaInput = document.querySelector("#fecha");
const filtroMascota = document.querySelector("#filtroMascota");

function obtenerLista(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error(`No se pudieron leer los datos de ${clave}:`, error);
        return [];
    }
}

function guardarHistorias(historias) {
    try {
        localStorage.setItem(CLAVE_HISTORIAS, JSON.stringify(historias));
        return true;
    } catch (error) {
        console.error("No se pudieron guardar las historias clínicas:", error);
        mostrarMensaje("No se pudieron guardar los datos en el navegador.", "danger");
        return false;
    }
}

function crearId() {
    return window.crypto?.randomUUID?.() ||
        `\({Date.now()}-\){Math.random().toString(16).slice(2)}`;
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

function obtenerMascotas() {
    return obtenerLista(CLAVE_MASCOTAS);
}

function nombreMascota(mascota) {
    return mascota.nombreMascota || mascota.nombre || "Mascota sin nombre";
}

function cargarSelectMascotas() {
    const mascotas = obtenerMascotas();
    const seleccionActual = mascotaInput.value;
    const filtroActual = filtroMascota.value;

    mascotaInput.replaceChildren();
    filtroMascota.replaceChildren();

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = mascotas.length
        ? "Seleccioná una mascota"
        : "Primero registrá una mascota";
    mascotaInput.append(opcionInicial);

    const opcionFiltro = document.createElement("option");
    opcionFiltro.value = "";
    opcionFiltro.textContent = "Todas las mascotas";
    filtroMascota.append(opcionFiltro);

    mascotas.forEach((mascota, indice) => {
        const id = String(mascota.idMascota ?? `sin-id-${indice}`);
        const etiqueta = `\({nombreMascota(mascota)}\){
            mascota.nombreDuenio ? ` — ${mascota.nombreDuenio}` : ""
        }`;

        for (const select of [mascotaInput, filtroMascota]) {
            const opcion = document.createElement("option");
            opcion.value = id;
            opcion.textContent = etiqueta;
            select.append(opcion);
        }
    });

    if ([...mascotaInput.options].some(
        (opcion) => opcion.value === seleccionActual
    )) {
        mascotaInput.value = seleccionActual;
    }

    if ([...filtroMascota.options].some(
        (opcion) => opcion.value === filtroActual
    )) {
        filtroMascota.value = filtroActual;
    }

    const sinMascotas = mascotas.length === 0;
    mascotaInput.disabled = sinMascotas;
    botonGuardar.disabled = sinMascotas;
    document.querySelector("#avisoSinMascotas")
        .classList.toggle("d-none", !sinMascotas);
}

function formatearFecha(fecha) {
    if (!fecha) return "-";
    const [anio, mes, dia] = fecha.split("-");
    return `\({dia}/\){mes}/${anio}`;
}

function agregarCelda(fila, texto) {
    const celda = document.createElement("td");
    celda.textContent = texto || "-";
    fila.append(celda);
}

function obtenerNombreEnRegistro(historia) {
    if (historia.mascota) return historia.mascota;

    const mascota = obtenerMascotas().find(
        (item) => String(item.idMascota) === String(historia.mascotaId)
    );

    return mascota ? nombreMascota(mascota) : "Mascota eliminada";
}

function renderizarHistorias() {
    const filtroId = filtroMascota.value;

    const historias = obtenerLista(CLAVE_HISTORIAS)
        .filter((historia) =>
            !filtroId || String(historia.mascotaId ?? "") === filtroId
        )
        .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));

    listaHistorias.replaceChildren();
    totalHistorias.textContent = historias.length;
    sinHistorias.classList.toggle("d-none", historias.length > 0);

    sinHistorias.textContent = filtroId
        ? "Esta mascota todavía no tiene registros clínicos."
        : "Todavía no hay registros clínicos.";

    historias.forEach((historia) => {
        const fila = document.createElement("tr");

        agregarCelda(fila, obtenerNombreEnRegistro(historia));
        agregarCelda(fila, historia.responsable);
        agregarCelda(fila, formatearFecha(historia.fecha));
        agregarCelda(fila, historia.veterinario);
        agregarCelda(fila, historia.diagnostico);
        agregarCelda(fila, historia.tratamiento);
        agregarCelda(fila, historia.peso ? `${historia.peso} kg` : "-");
        agregarCelda(
            fila,
            historia.temperatura ? `${historia.temperatura} °C` : "-"
        );
        agregarCelda(fila, formatearFecha(historia.proximoControl));
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
    const historia = obtenerLista(CLAVE_HISTORIAS)
        .find((item) => item.id === id);

    if (!historia) return;

    cargarSelectMascotas();

    const mascotaExistente = [...mascotaInput.options].some(
        (opcion) => opcion.value === String(historia.mascotaId)
    );

    if (mascotaExistente) {
        mascotaInput.value = String(historia.mascotaId);
    } else if (historia.mascota) {
        mostrarMensaje(
            "La mascota de este registro ya no está en el listado. " +
            "Elegí una mascota registrada para actualizarlo.",
            "warning"
        );
    }

    document.querySelector("#idHistoria").value = historia.id;
    document.querySelector("#responsable").value = historia.responsable || "";
    document.querySelector("#fecha").value = historia.fecha || "";
    document.querySelector("#veterinario").value = historia.veterinario || "";
    document.querySelector("#diagnostico").value = historia.diagnostico || "";
    document.querySelector("#tratamiento").value = historia.tratamiento || "";
    document.querySelector("#peso").value = historia.peso || "";
    document.querySelector("#temperatura").value = historia.temperatura || "";
    document.querySelector("#proximoControl").value =
        historia.proximoControl || "";
    document.querySelector("#observaciones").value =
        historia.observaciones || "";

    botonGuardar.textContent = "Guardar cambios";
    botonCancelar.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarHistoria(id) {
    const historia = obtenerLista(CLAVE_HISTORIAS)
        .find((item) => item.id === id);

    if (
        !historia ||
        !window.confirm(
            `¿Eliminar la historia clínica de ${obtenerNombreEnRegistro(historia)}?`
        )
    ) {
        return;
    }

    const historiasActualizadas = obtenerLista(CLAVE_HISTORIAS)
        .filter((item) => item.id !== id);

    if (!guardarHistorias(historiasActualizadas)) return;

    renderizarHistorias();
    mostrarMensaje("El registro clínico fue eliminado.", "success");
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    formulario.classList.add("was-validated");

    if (!formulario.checkValidity()) return;

    const mascotas = obtenerMascotas();
    const mascota = mascotas.find((item, indice) =>
        String(item.idMascota ?? `sin-id-${indice}`) === mascotaInput.value
    );

    if (!mascota) {
        mostrarMensaje("Seleccioná una mascota que esté registrada.", "danger");
        return;
    }

    const pesoValor = document.querySelector("#peso").value;
    const temperaturaValor = document.querySelector("#temperatura").value;

    const historia = {
        id: document.querySelector("#idHistoria").value || crearId(),
        mascotaId: String(
            mascota.idMascota ?? `sin-id-${mascotas.indexOf(mascota)}`
        ),
        mascota: nombreMascota(mascota),
        responsable: (
            mascota.nombreDuenio ||
            document.querySelector("#responsable").value
        ).trim(),
        fecha: fechaInput.value,
        veterinario: document.querySelector("#veterinario").value.trim(),
        diagnostico: document.querySelector("#diagnostico").value.trim(),
        tratamiento: document.querySelector("#tratamiento").value.trim(),
        peso: pesoValor ? Number(pesoValor) : "",
        temperatura: temperaturaValor ? Number(temperaturaValor) : "",
        proximoControl: document.querySelector("#proximoControl").value,
        observaciones: document.querySelector("#observaciones").value.trim()
    };

    const historias = obtenerLista(CLAVE_HISTORIAS);
    const indice = historias.findIndex((item) => item.id === historia.id);
    const editando = indice !== -1;

    if (editando) {
        historias[indice] = historia;
    } else {
        historias.push(historia);
    }

    if (!guardarHistorias(historias)) return;

    limpiarFormulario();
    renderizarHistorias();

    mostrarMensaje(
        editando
            ? "El registro clínico fue actualizado."
            : "El registro clínico fue guardado.",
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
filtroMascota.addEventListener("change", renderizarHistorias);

const hoy = new Date().toLocaleDateString("en-CA");
fechaInput.max = hoy;
document.querySelector("#proximoControl").min = hoy;

cargarSelectMascotas();
renderizarHistorias();

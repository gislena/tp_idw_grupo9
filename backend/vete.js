const CLAVE_STORAGE = "veterinarios";
let idEditando = null;
const form = document.getElementById("formVeterinario");
const tabla = document.getElementById("tablaVeterinarios");
const totalVeterinarios = document.getElementById("totalVeterinarios");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
function obtenerVeterinarios() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("No se pudieron leer los veterinarios guardados:", error);
        return [];
    }
}
function guardarVeterinarios(veterinarios) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(veterinarios));
        return true;
    } catch (error) {
        console.error("No se pudieron guardar los veterinarios:", error);
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
    const veterinarios = obtenerVeterinarios();
    tabla.replaceChildren();
    if (veterinarios.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 6;
        celda.className = "text-center text-muted";
        celda.textContent = "Todavía no hay veterinarios registrados.";
        fila.appendChild(celda);
        tabla.appendChild(fila);
    } else {
        const formatoMoneda = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS"
        });
        veterinarios.forEach((veterinario) => {
            const fila = document.createElement("tr");
            fila.appendChild(crearCelda(veterinario.idVeterinario));
            fila.appendChild(crearCelda(veterinario.matricula));
            fila.appendChild(crearCelda(veterinario.nombre));
            fila.appendChild(crearCelda(veterinario.especializacion));
            fila.appendChild(
                crearCelda(formatoMoneda.format(Number(veterinario.valorConsulta) || 0))
            );
            const celdaAcciones = document.createElement("td");
            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.className = "btn btn-warning btn-sm me-1";
            btnEditar.dataset.accion = "editar";
            btnEditar.dataset.id = veterinario.idVeterinario;
            btnEditar.textContent = "Editar";
            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.className = "btn btn-danger btn-sm";
            btnEliminar.dataset.accion = "eliminar";
            btnEliminar.dataset.id = veterinario.idVeterinario;
            btnEliminar.textContent = "Eliminar";
            celdaAcciones.append(btnEditar, btnEliminar);
            fila.appendChild(celdaAcciones);
            tabla.appendChild(fila);
        });
    }
    totalVeterinarios.textContent = veterinarios.length;
}
function editarVeterinario(id) {
    const veterinario = obtenerVeterinarios().find(
        (item) => item.idVeterinario === id
    );
    if (!veterinario) {
        alert("No se encontró el veterinario seleccionado.");
        return;
    }
    idEditando = id;
    document.getElementById("matricula").value = veterinario.matricula;
    document.getElementById("nombre").value = veterinario.nombre;
    document.getElementById("especializacion").value = veterinario.especializacion;
    document.getElementById("valorConsulta").value = veterinario.valorConsulta;
    btnGuardar.textContent = "Actualizar";
    btnCancelar.hidden = false;
    document.getElementById("matricula").focus();
}
function eliminarVeterinario(id) {
    const veterinarios = obtenerVeterinarios();
    const veterinario = veterinarios.find(
        (item) => item.idVeterinario === id
    );
    if (!veterinario) return;
    const confirmar = confirm(
        `¿Querés eliminar a ${veterinario.nombre}?`
    );
    if (!confirmar) return;
    const actualizados = veterinarios.filter(
        (item) => item.idVeterinario !== id
    );
    if (!guardarVeterinarios(actualizados)) return;
    if (idEditando === id) {
        form.reset();
    }
    actualizarTabla();
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const veterinarios = obtenerVeterinarios();
    const datosFormulario = {
        matricula: Number(document.getElementById("matricula").value),
        nombre: document.getElementById("nombre").value.trim(),
        especializacion: document.getElementById("especializacion").value.trim(),
        valorConsulta: Number(document.getElementById("valorConsulta").value)
    };
    if (idEditando) {
        const indice = veterinarios.findIndex(
            (item) => item.idVeterinario === idEditando
        );
        if (indice === -1) {
            alert("No se encontró el veterinario que querés actualizar.");
            form.reset();
            return;
        }
        veterinarios[indice] = {
            ...veterinarios[indice],
            ...datosFormulario
        };
    } else {
        veterinarios.push({
            idVeterinario: generarId(),
            ...datosFormulario
        });
    }
    if (!guardarVeterinarios(veterinarios)) return;
    form.reset();
    actualizarTabla();
});
form.addEventListener("reset", () => {
    idEditando = null;
    btnGuardar.textContent = "Guardar";
    btnCancelar.hidden = true;
});
btnCancelar.addEventListener("click", () => {
    form.reset();
});
tabla.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-accion]");
    if (!boton) return;
    const { accion, id } = boton.dataset;
    if (accion === "editar") {
        editarVeterinario(id);
    } else if (accion === "eliminar") {
        eliminarVeterinario(id);
    }
});
actualizarTabla();
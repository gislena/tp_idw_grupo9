// MOSTRAR / OCULTAR EL CAMPO DE FECHA

const motivoTurno = document.getElementById('motivoTurno');
const datosTurno = document.getElementById('datosTurno');
const camposTurno = datosTurno.querySelectorAll('input, select');
const inputFecha = document.getElementById('fecha');
const radios = document.querySelectorAll('input[name="motivo"]');


inputFecha.min = new Date().toLocaleDateString('en-CA');

function actualizarTurno() {
    if (motivoTurno.checked) {
        datosTurno.classList.remove('d-none');
    } else {
        datosTurno.classList.add('d-none'); 
    }

    for (let i = 0; i < camposTurno.length; i++) {
        if (motivoTurno.checked) {
            camposTurno[i].required = true;
        } else {
            camposTurno[i].required = false;
            camposTurno[i].value = '';
        }
    }
}

for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', actualizarTurno);
}



// ENVIAR EL FORMULARIO SIN SALIR DE LA PÁGINA

const form = document.getElementById('formContacto');
const alerta = document.getElementById('alertaForm');

form.addEventListener('submit', function (evento) {
    evento.preventDefault(); 

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(function (respuesta) {
        if (respuesta.ok) {
            alerta.innerHTML = '<div class="alert alert-success">¡Gracias! Recibimos tu consulta y te vamos a responder pronto.</div>';
            form.reset();
            actualizarTurno(); 
        } else {
            alerta.innerHTML = '<div class="alert alert-danger">No pudimos enviar tu consulta. Probá de nuevo en unos minutos.</div>';
        }
    })
    .catch(function () {
        alerta.innerHTML = '<div class="alert alert-danger">Hubo un problema de conexión. Probá de nuevo.</div>';
    });
});



// INSTAGRAM EN VENTANA EMERGENTE
const linkInstagram = document.getElementById('linkInstagram');

linkInstagram.addEventListener('click', function (evento) {
    const ventana = window.open(linkInstagram.href, 'instagram', 'popup=yes,width=520,height=720');

    if (ventana) {
        evento.preventDefault();
    }
});

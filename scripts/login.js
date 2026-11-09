const URL_API_LOGIN = 'https://dummyjson.com/auth/login';

const formularioLogin = document.querySelector('#formularioLogin');
const campoUsuario = document.querySelector('#usuario');
const campoClave = document.querySelector('#clave');
const mensajeLogin = document.querySelector('#mensajeLogin');
const botonIngresar = document.querySelector('#botonIngresar');

function obtenerDestino() {
    const volver = new URLSearchParams(location.search).get('volver');
    const esRutaRelativa = volver && !/^(?:[a-z]+:)?\/\//i.test(volver) && !volver.startsWith('/');
    return esRutaRelativa ? volver : '../index.html';
}

function mostrarError(texto) {
    mensajeLogin.innerHTML = '';
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-danger mb-3';
    alerta.setAttribute('role', 'alert');
    alerta.textContent = texto;
    mensajeLogin.appendChild(alerta);
}

if (Sesion.haySesion()) {
    location.replace(obtenerDestino());
}

formularioLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensajeLogin.innerHTML = '';

    if (!formularioLogin.checkValidity()) {
        formularioLogin.classList.add('was-validated');
        return;
    }

    botonIngresar.disabled = true;
    botonIngresar.textContent = 'Ingresando...';

    try {
        const respuesta = await fetch(URL_API_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: campoUsuario.value.trim(),
                password: campoClave.value,
                expiresInMins: 60
            })
        });

        if (!respuesta.ok) {
            mostrarError('Usuario o contraseña incorrectos. Verificá los datos e intentá otra vez.');
            return;
        }

        const datos = await respuesta.json();
        const token = datos.accessToken || datos.token;

        if (!token) {
            mostrarError('El servidor no devolvió un token válido. Intentá nuevamente.');
            return;
        }

        Sesion.guardarSesion(token, datos);
        location.href = obtenerDestino();
    } catch (error) {
        mostrarError('No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.');
    } finally {
        botonIngresar.disabled = false;
        botonIngresar.textContent = 'Ingresar';
    }
});

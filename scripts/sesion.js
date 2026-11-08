(function () {
    const CLAVE_TOKEN = 'token';
    const CLAVE_NOMBRE = 'usuario';
    const urlScript = new URL(document.currentScript ? document.currentScript.src : location.href);
    const URL_RAIZ = new URL('../', urlScript);
    const URL_LOGIN = new URL('paginas/login.html', URL_RAIZ);

    function obtenerToken() {
        return sessionStorage.getItem(CLAVE_TOKEN);
    }

    function haySesion() {
        return Boolean(obtenerToken());
    }

    function guardarSesion(token, datos) {
        sessionStorage.setItem(CLAVE_TOKEN, token);
        const nombre = [datos.firstName, datos.lastName].filter(Boolean).join(' ')
            || datos.username
            || '';
        sessionStorage.setItem(CLAVE_NOMBRE, nombre);
    }

    function cerrarSesion() {
        sessionStorage.removeItem(CLAVE_TOKEN);
        sessionStorage.removeItem(CLAVE_NOMBRE);
        location.href = URL_LOGIN.href;
    }

    /* Redirige al login si no hay sesión, guardando la página pedida. */
    function protegerPagina() {
        if (haySesion()) {
            return;
        }
        const volver = location.href.replace(URL_RAIZ.href, '');
        location.replace(URL_LOGIN.href + '?volver=' + encodeURIComponent(volver));
    }

    function actualizarNavegacion() {
        const sesion = haySesion();

        document.querySelectorAll('[data-admin]').forEach((elemento) => {
            elemento.hidden = !sesion;
        });
        document.querySelectorAll('[data-invitado]').forEach((elemento) => {
            elemento.hidden = sesion;
        });
        document.querySelectorAll('[data-nombre-usuario]').forEach((elemento) => {
            elemento.textContent = sessionStorage.getItem(CLAVE_NOMBRE) || '';
        });
        document.querySelectorAll('[data-cerrar-sesion]').forEach((boton) => {
            boton.addEventListener('click', cerrarSesion);
        });
    }

    window.Sesion = {
        obtenerToken,
        haySesion,
        guardarSesion,
        cerrarSesion,
        protegerPagina,
        actualizarNavegacion,
        urlLogin: URL_LOGIN.href
    };

    document.addEventListener('DOMContentLoaded', actualizarNavegacion);
})();

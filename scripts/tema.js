const botonTema = document.querySelector('#botonTema');

function actualizarTema(modoOscuro) {
    document.body.classList.toggle('modo-oscuro', modoOscuro);
    botonTema.setAttribute('aria-pressed', modoOscuro);
    botonTema.textContent = modoOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
}

const modoGuardado = localStorage.getItem('modo-oscuro') === 'true';
actualizarTema(modoGuardado);

botonTema.addEventListener('click', () => {
    const modoOscuro = !document.body.classList.contains('modo-oscuro');
    localStorage.setItem('modo-oscuro', modoOscuro);
    actualizarTema(modoOscuro);
});

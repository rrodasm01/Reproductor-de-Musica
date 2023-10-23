const cabecera = document.querySelector('.cabecera');
const sonidos = ['Ben10', 'InazumaEleven', 'PhineasYFerb'];
let cancionActual = 0;
let reproduciendo = false;
const galeriaImagenes = document.querySelector('.imagen');

// Define una lista de reproducción con información de duración de las canciones
const playlist = [
    { title: 'Ben10', duration: '1:03' },
    { title: 'InazumaEleven', duration: '1:39' },
    { title: 'PhineasYFerb', duration: '0:56' }
];

document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById(sonidos[cancionActual]);
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const randomButton = document.getElementById('random-button');
    const volumeButton = document.getElementById('volume-button');
    const sliderVolumen = document.getElementById('sliderVolumen');
    const sliderTiempo = document.getElementById('sliderTiempo');
    const currentTimeSpan = document.getElementById('current-time');
    const songDurationSpan = document.getElementById('song-duration');

    sliderTiempo.value = 0;

    audioElement.addEventListener('timeupdate', () => {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;

        // Actualiza el tiempo actual
        currentTimeSpan.textContent = formatTime(currentTime);

        // Actualiza la barra de progreso
        const progreso = (currentTime / duration) * 100;
        sliderTiempo.value = progreso;
    });

    sliderTiempo.addEventListener('input', () => {
        // Cambia la posición de reproducción cuando el usuario ajusta la barra de progreso
        const progreso = sliderTiempo.value;
        const duration = audioElement.duration;
        audioElement.currentTime = (progreso / 100) * duration;
    });

    function formatTime(seconds) {
        const minutos = Math.floor(seconds / 60);
        const segundos = Math.floor(seconds % 60);
        return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    }

    // Añadir la funcionalidad para el botón de Aleatorio (shuffle)
    randomButton.addEventListener('click', () => {
        reproducirAleatorio();
    });

    // Añadir la funcionalidad para el botón de Volumen y la barra de Volumen
    volumeButton.addEventListener('click', () => {
        if (audioElement.volume === 0) {
            audioElement.volume = sliderVolumen.value / 100;
            volumeButton.classList.remove('muted');
        } else {
            audioElement.volume = 0;
            volumeButton.classList.add('muted');
        }
    });

    sliderVolumen.addEventListener('input', () => {
        audioElement.volume = sliderVolumen.value / 100;
        if (audioElement.volume === 0) {
            volumeButton.classList.add('muted');
        } else {
            volumeButton.classList.remove('muted');
        }
    });

    playButton.addEventListener('click', () => {
        reproducirCancion();
    });

    pauseButton.addEventListener('click', () => {
        pausarCancion();
    });

    previousButton.addEventListener('click', () => {
        cancionAnterior();
    });

    nextButton.addEventListener('click', () => {
        cancionSiguiente();
    });

    function reproducirCancion() {
        audioElement.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
        reproduciendo = true;
        updateSongDuration(); // Actualiza la duración al reproducir una canción
    }

    function pausarCancion() {
        audioElement.pause();
        playButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';
        reproduciendo = false;
    }

    function cancionAnterior() {
        pausarCancion();
        cancionActual = (cancionActual - 1 + sonidos.length) % sonidos.length;
        actualizarCancion();
    }

    function cancionSiguiente() {
        pausarCancion();
        cancionActual = (cancionActual + 1) % sonidos.length;
        actualizarCancion();
    }

    function actualizarCancion() {
        audioElement.src = document.getElementById(sonidos[cancionActual]).src;
        document.getElementById('tituloCancion').innerText = sonidos[cancionActual];
        updateSongDuration(); // Actualiza la duración al cambiar de canción
        actualizarImagen();
        reproducirCancion(); // Reproduce automáticamente la nueva canción
    }

    function actualizarImagen() {
        galeriaImagenes.style.transform = `translateX(-${cancionActual * 200}px)`;
    }

    sonidos.forEach((sonido, index) => {
        const boton = document.createElement('div');
        boton.classList.add('boton');

        const texto = document.createElement('h2');
        texto.innerText = sonido;

        boton.appendChild(texto);

        boton.addEventListener('click', () => {
            pausarCancion();
            cancionActual = index;
            actualizarCancion();
        });

        document.querySelector('.botones').appendChild(boton);

        if (index === 0) {
            actualizarCancion();
        }
    });

    function reproducirAleatorio() {
        pausarCancion();
        let cancionAleatoria;

        do {
            cancionAleatoria = Math.floor(Math.random() * sonidos.length);
        } while (cancionAleatoria === cancionActual); // Evita reproducir la misma canción

        cancionActual = cancionAleatoria;
        actualizarCancion();
    }

    // Agrega esta función para actualizar la duración de la canción actual
    function updateSongDuration() {
        const currentSong = playlist[cancionActual]; // Suponiendo que tienes una lista de reproducción llamada "playlist"

        if (currentSong) {
            songDurationSpan.textContent = currentSong.duration;
        }
    }
});

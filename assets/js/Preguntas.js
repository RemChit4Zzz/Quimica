let preguntas = [];

    // Función para mostrar cinco preguntas aleatorias
    function mostrarCincoPreguntasAleatorias() {
        fetch('../../JSON/Preguntas.json') // Cambia la ruta del archivo si es necesario
            .then(response => response.json())
            .then(data => {
                const preguntasContainer = document.getElementById('preguntas-container');
                preguntasContainer.style.display = 'block';

                preguntas = [];

                for (let i = 0; i < 5; i++) {
                    const preguntaDiv = preguntasContainer.getElementsByClassName('pregunta')[i];
                    const preguntaText = preguntaDiv.getElementsByClassName('pregunta-text')[0];
                    const respuestasDiv = preguntaDiv.getElementsByClassName('respuestas')[0];
                    const preguntaAleatoria = obtenerPreguntaAleatoria(data.preguntas);

                    preguntaText.textContent = 'Pregunta ' + (i + 1) + ': ' + preguntaAleatoria.pregunta;

                    // Mezcla las respuestas de forma aleatoria
                    const respuestas = mezclarRespuestas([preguntaAleatoria.good, ...preguntaAleatoria.wrong]);

                    const radioButtons = respuestasDiv.getElementsByClassName('respuesta');
                    const respuestaTexts = respuestasDiv.getElementsByClassName('respuesta-text');

                    for (let j = 0; j < radioButtons.length; j++) {
                        radioButtons[j].value = respuestas[j];
                        respuestaTexts[j].textContent = obtenerLetra(j) + ') ' + respuestas[j];
                    }

                    preguntas.push(preguntaAleatoria);
                }

                // Mostrar el botón "Check" y ocultar el botón "Restart"
                document.getElementById('check').style.display = 'block';
                document.getElementById('restart').style.display = 'none';
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));
    }

    // Función para mezclar las respuestas de forma aleatoria
    function mezclarRespuestas(respuestas) {
        for (let i = respuestas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
        }
        return respuestas;
    }

    // Función para obtener una pregunta aleatoria sin repetirla
    function obtenerPreguntaAleatoria(preguntasDisponibles) {
        let preguntaAleatoria;
        do {
            preguntaAleatoria = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
        } while (preguntas.includes(preguntaAleatoria));
        return preguntaAleatoria;
    }

    // Función para obtener la letra correspondiente a una opción (a, b, c, ...)
    function obtenerLetra(indice) {
        return String.fromCharCode(97 + indice); // 97 es el código ASCII de 'a'
    }

    // Llama a la función para mostrar preguntas al cargar la página
    mostrarCincoPreguntasAleatorias();

    // Función para verificar respuestas
    document.getElementById('check').addEventListener('click', () => {
        const respuestasCorrectas = [false, false, false, false, false];
        const respuestasIncorrectas = [[], [], [], [], []];

        let alMenosUnaRespuestaSeleccionada = false;

        for (let i = 0; i < 5; i++) {
            const respuestaSeleccionada = document.querySelector('input[name="respuesta' + i + '"]:checked');
            if (respuestaSeleccionada) {
                alMenosUnaRespuestaSeleccionada = true;
                const respuestaUsuario = respuestaSeleccionada.value;
                if (respuestaUsuario === preguntas[i].good) {
                    respuestasCorrectas[i] = true;
                } else {
                    respuestasIncorrectas[i].push({
                        insiso: obtenerLetra(i),
                        respuestaCorrecta: preguntas[i].good
                    });
                }
            }
        }

        if (!alMenosUnaRespuestaSeleccionada) {
            document.getElementById('mensaje').textContent = 'Por favor, selecciona al menos una respuesta antes de hacer clic en "Check".';
            return;
        }

        const resultado = respuestasCorrectas.every(respuesta => respuesta);

        if (resultado) {
            document.getElementById('mensaje').innerHTML = 'Todas las respuestas son correctas.';
        } else {
            let mensaje = 'Al menos una de las respuestas es incorrecta.<br>';

            for (let i = 0; i < 5; i++) {
                if (!respuestasCorrectas[i]) {
                    mensaje += 'Pregunta ' + (i + 1) + ' (Respuesta correcta: ';
                    mensaje += '<span class="respuesta-correcta">' + respuestasIncorrectas[i].map(item => item.insiso + ': ' + item.respuestaCorrecta).join(', ') + '</span>';
                    mensaje += ')<br>';
                }
            }

            document.getElementById('mensaje').innerHTML = mensaje;
        }

        // Ocultar el botón "Check" y mostrar el botón "Restart"
        document.getElementById('check').style.display = 'none';
        document.getElementById('restart').style.display = 'block';
    });

    // Función para reiniciar el juego
    document.getElementById('restart').addEventListener('click', () => {
        document.getElementById('preguntas-container').style.display = 'none';
        document.getElementById('mensaje').textContent = '';
        document.getElementById('restart').style.display = 'none'; // Ocultar el botón "Restart"

        // Deseleccionar todas las opciones de radio
        const opcionesRadio = document.querySelectorAll('.respuesta');
        opcionesRadio.forEach(opcion => {
            opcion.checked = false;
        });

        mostrarCincoPreguntasAleatorias();
    });
let preguntas = [];
        let preguntaActual = null;
        let respuestasActuales = [];

        // Función para mostrar una pregunta en la página
        function mostrarPregunta(pregunta) {
            const preguntaContainer = document.getElementById('pregunta');
            preguntaContainer.innerHTML = pregunta.pregunta.replace(/__BLANK__/g, '<div class="cuadro-en-blanco" ondrop="drop(event)" ondragover="allowDrop(event)"></div>');

            respuestasActuales = pregunta.respuesta_correcta.split(', ').concat(pregunta.respuestas_incorrectas);
            shuffleArray(respuestasActuales);

            const respuestasContainer = document.getElementById('respuestasContainer');
            respuestasContainer.innerHTML = '';

            respuestasActuales.forEach((respuesta, index) => {
                if (respuesta !== "__BLANK__") {
                    respuestasContainer.innerHTML += `
                        <div class="respuesta" draggable="true" ondragstart="drag(event)">${respuesta}</div>
                    `;
                }
            });
        }

        // Función para verificar si la respuesta es correcta al soltar una opción en un cuadro en blanco
        function drop(event) {
            event.preventDefault();
            const data = event.dataTransfer.getData("text");
            const cuadro = event.target;

            cuadro.textContent = data;

            verificarRespuesta(); // Verificar automáticamente al soltar una opción en un cuadro en blanco
        }

        // Función para permitir la colocación de respuestas en cuadros
        function allowDrop(event) {
            event.preventDefault();
        }

        // Función para arrastrar respuestas
        function drag(event) {
            event.dataTransfer.setData("text", event.target.textContent);
        }

        // Función para verificar si la respuesta es correcta
        function verificarRespuesta() {
            const resultadoContainer = document.getElementById('resultado');
            const mensajeRespuesta = document.getElementById('mensajeRespuesta');
            resultadoContainer.innerHTML = ''; // Limpiamos el resultado anterior

            if (preguntaActual) {
                const respuestasCorrectas = preguntaActual.respuesta_correcta.split(', ');
                const cuadrosEnBlanco = document.querySelectorAll('.cuadro-en-blanco');

                if (cuadrosEnBlanco.length !== respuestasCorrectas.length) {
                    mensajeRespuesta.textContent = 'Respuesta Incorrecta. Inténtalo de nuevo.';
                    return;
                }

                for (let i = 0; i < cuadrosEnBlanco.length; i++) {
                    const respuestaEnCuadro = cuadrosEnBlanco[i].textContent.trim();

                    if (respuestaEnCuadro !== respuestasCorrectas[i]) {
                        mensajeRespuesta.textContent = 'Respuesta Incorrecta. Inténtalo de nuevo.';
                        return;
                    }
                }

                mensajeRespuesta.textContent = '¡Respuesta Correcta!';
                setTimeout(mostrarPreguntaAleatoria, 1000); // Mostrar la siguiente pregunta después de 1 segundo
            }
        }

        // Función para mezclar aleatoriamente un array (Fisher-Yates shuffle)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Función para mostrar una pregunta aleatoria
        function mostrarPreguntaAleatoria() {
            if (preguntas.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * preguntas.length);
                preguntaActual = preguntas[indiceAleatorio];
                mostrarPregunta(preguntaActual);
                document.getElementById('mensajeRespuesta').textContent = ''; // Limpiar el mensaje de respuesta
            }
        }

        // Realiza una solicitud fetch para obtener el archivo JSON
        fetch('../../JSON/Trivia.json')
            .then(response => response.json())
            .then(data => {
                // Obtiene todas las preguntas de todos los temas
                data['Drag And Drop'].forEach(tema => {
                    preguntas = preguntas.concat(tema.preguntas);
                });

                // Muestra la primera pregunta aleatoria cuando se complete la solicitud
                mostrarPreguntaAleatoria();
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });

        // Agregar un evento al botón "Check" para verificar la respuesta manualmente
        document.getElementById('verificarRespuestaManualmente').addEventListener('click', () => {
            verificarRespuesta();
        });
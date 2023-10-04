document.addEventListener("DOMContentLoaded", function () {
    var pregunta = document.getElementById("pregunta");
    var respuestasDiv = document.getElementById("respuestas");
    var nuevaPreguntaBtn = document.getElementById("nuevaPreguntaBtn");
    var iniciarBtn = document.createElement("button"); // Botón "Iniciar"
    var mensajeFinal = document.createElement("div"); // Elemento para mostrar el mensaje final
    var reiniciarBtn = document.createElement("button"); // Botón de reinicio
    var puntuacion = 0; // Variable para realizar un seguimiento de la puntuación del jugador

    iniciarBtn.textContent = "Iniciar"; // Texto del botón "Iniciar"
    reiniciarBtn.textContent = "Reiniciar Juego"; // Texto del botón de reinicio

    iniciarBtn.addEventListener("click", function () {
        iniciarJuego();
    });

    reiniciarBtn.addEventListener("click", function () {
        reiniciarJuego();
    });

    document.body.appendChild(iniciarBtn); // Agregar el botón "Iniciar" al cuerpo del documento
    document.body.appendChild(mensajeFinal); // Agregar el elemento del mensaje final al cuerpo del documento
    mensajeFinal.appendChild(reiniciarBtn); // Agregar el botón de reinicio al mensaje final

    reiniciarBtn.style.display = "none"; // Ocultar el botón de reinicio al principio

    var temas = [];
    var ejemplosPorTema = {};
    var rondas = 10; // Número de rondas
    var rondaActual = 0;
    var juegoIniciado = false; // Bandera para controlar si el juego está en curso

    async function cargarTemasDesdeJSON() {
        try {
            const response = await fetch("../../JSON/Impostor.json");
            const data = await response.json();
            temas = data.map(item => item.Tema);
            ejemplosPorTema = data.reduce((acc, item) => {
                acc[item.Tema] = item.Ejemplos;
                return acc;
            }, {});
        } catch (error) {
            console.error("Error al cargar el archivo JSON:", error);
        }
    }

    nuevaPreguntaBtn.addEventListener("click", function () {
        nuevaRonda();
    });

    async function iniciarJuego() {
        await cargarTemasDesdeJSON(); // Esperar a que los temas se carguen
        iniciarBtn.style.display = "none"; // Ocultar el botón de iniciar
        reiniciarBtn.style.display = "none"; // Ocultar el botón de reinicio al inicio
        rondaActual = 0; // Reiniciar rondas
        juegoIniciado = true; // Marcar que el juego está en curso
        puntuacion = 0; // Reiniciar la puntuación
        nuevaRonda();
    }

    function mostrarMensajeFinal() {
        pregunta.textContent = "Juego terminado";
        mensajeFinal.style.display = "block"; // Mostrar el mensaje final

        respuestasDiv.style.display = "none"; // Ocultar las respuestas
        reiniciarBtn.style.display = "block"; // Mostrar el botón de reinicio
    }

    function reiniciarJuego() {
        rondaActual = 0; // Reiniciar rondas
        mensajeFinal.style.display = "none"; // Ocultar el mensaje final
        respuestasDiv.style.display = "block"; // Mostrar las respuestas
        reiniciarBtn.style.display = "none"; // Ocultar el botón de reinicio
        puntuacion = 0; // Reiniciar la puntuación
        nuevaRonda(); // Comenzar una nueva ronda
    }

    function actualizarPuntuacion() {
        var scoreElement = document.getElementById("score");
        scoreElement.textContent = "Puntuación: " + puntuacion;
    }

    function nuevaRonda() {
        if (juegoIniciado) { // Verificar que el juego esté en curso antes de continuar
            if (rondaActual < rondas) {
                rondaActual++;
                var preguntaElement = document.getElementById("pregunta");
                preguntaElement.textContent = ""; // Limpiar contenido previo de pregunta

                var temaSeleccionado = temas[Math.floor(Math.random() * temas.length)];
                var ejemplosSeleccionados = ejemplosPorTema[temaSeleccionado];
                var ejemploCorrecto = ejemplosSeleccionados[Math.floor(Math.random() * ejemplosSeleccionados.length)];

                // Mostrar la pregunta
                preguntaElement.textContent = "Ronda " + rondaActual + ": ¿Cuál de los siguientes es un ejemplo de '" + temaSeleccionado + "'?";

                // Agregar respuestas incorrectas de otros temas
                var respuestasIncorrectas = [];
                while (respuestasIncorrectas.length < 3) {
                    var temaIncorrecto = temas[Math.floor(Math.random() * temas.length)];
                    if (temaIncorrecto !== temaSeleccionado) {
                        var ejemplosIncorrectos = ejemplosPorTema[temaIncorrecto];
                        var ejemploIncorrecto = ejemplosIncorrectos[Math.floor(Math.random() * ejemplosIncorrectos.length)];
                        if (!respuestasIncorrectas.includes(ejemploIncorrecto)) {
                            respuestasIncorrectas.push(ejemploIncorrecto);
                        }
                    }
                }

                // Mezclar respuestas incorrectas con respuesta correcta
                var opciones = respuestasIncorrectas.concat(ejemploCorrecto);

                // Mezclar todas las opciones
                opciones = shuffle(opciones);

                // Mostrar las opciones de respuesta como botones
                respuestasDiv.innerHTML = '';
                for (var i = 0; i < opciones.length; i++) {
                    var botonRespuesta = document.createElement("button");
                    botonRespuesta.textContent = opciones[i];
                    botonRespuesta.addEventListener("click", function (event) {
                        if (event.target.textContent === ejemploCorrecto) {
                            puntuacion += 100; // Sumar 100 puntos por respuesta correcta
                        } else {
                            puntuacion -= 50; // Restar 50 puntos por respuesta incorrecta
                        }
                        actualizarPuntuacion(); // Actualizar la puntuación después de cada respuesta
                        nuevaRonda();
                    });
                    respuestasDiv.appendChild(botonRespuesta);
                }
            } else {
                mostrarMensajeFinal();
            }
        }
    }

    // Función para mezclar un arreglo
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
});

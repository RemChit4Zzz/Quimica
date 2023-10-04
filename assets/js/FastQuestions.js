const pregunta = document.getElementById("pregunta");
const botonFisico = document.getElementById("boton-fisico");
const botonQuimico = document.getElementById("boton-quimico");
const puntuacionElement = document.getElementById("puntuacion");
const tiempoRestanteElement = document.getElementById("tiempo-restante");
const botonComenzar = document.getElementById("boton-comenzar");
const botonReinicio = document.getElementById("boton-reinicio");
const preguntasIncorrectasElement = document.getElementById("preguntas-incorrectas");
const respuestasCorrectasElement = document.getElementById("respuestas-correctas");

let preguntas;
let preguntaActual = 0;
let puntuacion = 0;
let tiempoRestante = 15;
let cronometro;
let juegoIniciado = false;
let preguntasIncorrectas = [];
let mostrarRespuestasTimeout; // Variable para controlar el tiempo de visualización de las respuestas

function obtenerPreguntasAleatorias(cantidad) {
  const indicesDisponibles = Array.from(Array(preguntas.length).keys());
  const preguntasAleatorias = [];

  for (let i = 0; i < cantidad; i++) {
    const indiceAleatorio = Math.floor(Math.random() * indicesDisponibles.length);
    const indicePregunta = indicesDisponibles.splice(indiceAleatorio, 1)[0];
    preguntasAleatorias.push(preguntas[indicePregunta]);
  }

  return preguntasAleatorias;
}

function mostrarPregunta() {
  pregunta.textContent = `Pregunta ${preguntaActual + 1}: ${preguntas[preguntaActual].enunciado}`;
  botonFisico.textContent = "Físico";
  botonQuimico.textContent = "Químico";
  tiempoRestanteElement.style.display = "block";
  botonFisico.style.display = "block";
  botonQuimico.style.display = "block";
  iniciarCronometro();
  actualizarPuntuacion();
}

function ocultarPregunta() {
  pregunta.textContent = "";
  botonFisico.textContent = "";
  botonQuimico.textContent = "";
  tiempoRestanteElement.style.display = "none";
  botonFisico.style.display = "none";
  botonQuimico.style.display = "none";
}

function iniciarCronometro() {
  tiempoRestante = 15;
  cronometro = setInterval(actualizarCronometro, 1000);
}

function detenerCronometro() {
  clearInterval(cronometro);
}

function actualizarCronometro() {
  if (tiempoRestante > 0) {
    tiempoRestante--;
    tiempoRestanteElement.textContent = `Tiempo restante: ${tiempoRestante}s`;
  } else {
    detenerCronometro();
    alert("Time Over");
    reiniciarJuego();
  }
}

function pasarSiguientePregunta() {
  detenerCronometro();
  preguntaActual++;
  if (preguntaActual >= preguntas.length) {
    mostrarResultado();
    botonReinicio.style.display = "block";
    ocultarElementos();
  } else {
    mostrarPregunta();
  }
}

function ocultarElementos() {
  pregunta.style.display = "none";
  botonFisico.style.display = "none";
  botonQuimico.style.display = "none";
  tiempoRestanteElement.style.display = "none";
  // No ocultamos la puntuación aquí
  preguntasIncorrectasElement.style.display = "none";
  botonReinicio.style.display = "block";
}

botonQuimico.addEventListener("click", () => {
  detenerCronometro();
  if (preguntas[preguntaActual].respuesta === "químico") {
    puntuacion += 100;
  } else {
    puntuacion -= 50;
    preguntasIncorrectas.push({
      pregunta: preguntas[preguntaActual].enunciado,
      respuesta: preguntas[preguntaActual].respuesta,
    });
  }
  pasarSiguientePregunta();
});

botonFisico.addEventListener("click", () => {
  detenerCronometro();
  if (preguntas[preguntaActual].respuesta === "físico") {
    puntuacion += 100;
  } else {
    puntuacion -= 50;
    preguntasIncorrectas.push({
      pregunta: preguntas[preguntaActual].enunciado,
      respuesta: preguntas[preguntaActual].respuesta,
    });
  }
  pasarSiguientePregunta();
});

botonComenzar.addEventListener("click", () => {
  iniciarJuego();
  botonComenzar.style.display = "none";
});

botonReinicio.addEventListener("click", () => {
  reiniciarJuego();
});

function iniciarJuego() {
  juegoIniciado = true;
  preguntas = obtenerPreguntasAleatorias(10);
  preguntaActual = 0;
  puntuacion = 0;
  mostrarPregunta();
  botonReinicio.style.display = "none";
  respuestasCorrectasElement.textContent = ""; // Ocultar las respuestas al iniciar el juego
}

function actualizarPuntuacion() {
  puntuacionElement.textContent = `Puntuación: ${puntuacion}`;
}

function mostrarResultado() {
  const buenas = preguntas.length - preguntasIncorrectas.length;
  const malas = preguntasIncorrectas.length;

  document.getElementById("buenas").textContent = buenas;
  document.getElementById("malas").textContent = malas;

  document.getElementById("resultado").style.display = "block";

  // Mostrar las respuestas correctas
  respuestasCorrectasElement.textContent = "Respuestas correctas: ";
  for (let i = 0; i < preguntas.length; i++) {
    if (preguntas[i].respuesta === "químico" || preguntas[i].respuesta === "físico") {
      respuestasCorrectasElement.textContent += `${i + 1}: ${preguntas[i].respuesta} | `;
    }
  }
}

function reiniciarJuego() {
  juegoIniciado = false;
  botonReinicio.style.display = "none";
  botonComenzar.style.display = "block";
  ocultarPregunta();
  actualizarPuntuacion();
  preguntasIncorrectas = [];
  document.getElementById("resultado").style.display = "none";
  pregunta.style.display = "block";

  // Ocultar solo las respuestas cuando se reinicia el juego
  clearTimeout(mostrarRespuestasTimeout); // Cancelar el tiempo de visualización de las respuestas
  respuestasCorrectasElement.textContent = "";
}

// Cargar las preguntas desde el archivo JSON
fetch("../../JSON/Fas.json")
  .then(response => response.json())
  .then(data => {
    preguntas = data.preguntas;
  })
  .catch(error => console.error(error));

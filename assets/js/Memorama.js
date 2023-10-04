// Lista de elementos químicos con sus nombres y símbolos
const elementos = [
  { nombre: 'Hidrógeno', simbolo: 'H' },
  { nombre: 'Oxígeno', simbolo: 'O' },
  { nombre: 'Carbono', simbolo: 'C' },
  { nombre: 'Nitrógeno', simbolo: 'N' },
  { nombre: 'Hierro', simbolo: 'Fe' },
  { nombre: 'Oro', simbolo: 'Au' },
  { nombre: 'Plata', simbolo: 'Ag' },
  { nombre: 'Cobre', simbolo: 'Cu' },
  { nombre: 'Aluminio', simbolo: 'Al' },
  { nombre: 'Litio', simbolo: 'Li' },
  { nombre: 'Sodio', simbolo: 'Na' },
  { nombre: 'Potasio', simbolo: 'K' },
  { nombre: 'Magnesio', simbolo: 'Mg' },
  { nombre: 'Calcio', simbolo: 'Ca' },
  { nombre: 'Fósforo', simbolo: 'P' },
  { nombre: 'Azufre', simbolo: 'S' },
  { nombre: 'Cloro', simbolo: 'Cl' },
  { nombre: 'Zinc', simbolo: 'Zn' },
  { nombre: 'Mercurio', simbolo: 'Hg' },
  { nombre: 'Plomo', simbolo: 'Pb' }
];

// Variables para el juego
let currentRound = 0; // Cambiado a 0 para iniciar en la ronda 1
let usedElements = [];
let correctSymbol = "";

// Obtener elementos HTML
const elementNameElement = document.getElementById('element-name');
const roundElement = document.getElementById('round');
const blocksElement = document.getElementById('blocks');
const messageElement = document.getElementById('message');
const victoryMessageElement = document.getElementById('victory-message'); // Nuevo elemento
const restartButtonElement = document.getElementById('restart-button'); // Nuevo elemento

// Función para seleccionar aleatoriamente un elemento químico no utilizado y opciones de respuesta
function selectRandomElementAndOptions() {
  const availableElements = elementos.filter(element => !usedElements.includes(element.simbolo));
  if (availableElements.length === 0) {
      // Si se han utilizado todos los elementos, reiniciar la lista de elementos utilizados
      usedElements = [];
  }
  const randomIndex = Math.floor(Math.random() * availableElements.length);
  const selectedElement = availableElements[randomIndex];
  usedElements.push(selectedElement.simbolo);

  // Crear un conjunto de opciones que incluye 8 símbolos incorrectos
  const options = new Set();

  while (options.size < 11) {
      const randomOption = availableElements[Math.floor(Math.random() * availableElements.length)].simbolo;
      if (randomOption !== selectedElement.simbolo) {
          options.add(randomOption);
      }
  }

  // Añadir la respuesta correcta en una posición aleatoria
  const randomIndexForCorrectOption = Math.floor(Math.random() * 9);
  const optionsArray = Array.from(options);
  optionsArray.splice(randomIndexForCorrectOption, 0, selectedElement.simbolo);

  return { selectedElement, options: optionsArray };
}

// Función para cargar el juego de la próxima ronda
function loadNextRound() {
  // Seleccionar un elemento químico aleatorio no utilizado y opciones de respuesta
  const { selectedElement, options } = selectRandomElementAndOptions();

  // Mostrar el nombre del elemento
  elementNameElement.textContent = selectedElement.nombre;
  correctSymbol = selectedElement.simbolo;

  // Actualizar el número de ronda
  currentRound++;
  roundElement.textContent = currentRound.toString();

  // Mostrar las opciones de respuesta como bloques
  blocksElement.innerHTML = '';
  for (const option of options) {
      const block = document.createElement('div');
      block.classList.add('block');
      block.textContent = option;

      // Agregar evento click a cada bloque
      block.addEventListener('click', () => checkAnswer(option));

      blocksElement.appendChild(block);
  }
}

// Función para comprobar si la respuesta es correcta
function checkAnswer(selectedSymbol) {
  if (selectedSymbol === correctSymbol) {
      messageElement.textContent = '¡Respuesta correcta!';
      setTimeout(() => {
          messageElement.textContent = '';
          if (currentRound === 9) {
              // El juego ha terminado después de 9 rondas
              victoryMessageElement.style.display = 'block';
              elementNameElement.style.display = 'none';
              roundElement.style.display = 'none';
              blocksElement.style.display = 'none';
              messageElement.style.display = 'none';
              restartButtonElement.style.display = 'block'; // Mostrar el botón de volver a jugar
          } else {
              // Cargar automáticamente la próxima ronda
              loadNextRound();
          }
      }, 1500);
  } else {
      messageElement.textContent = 'Respuesta incorrecta. Intenta de nuevo.';
  }
}

// Función para reiniciar el juego
function restartGame() {
  currentRound = 0;
  usedElements = [];
  loadNextRound();
  // Restaurar elementos ocultos
  elementNameElement.style.display = 'block';
  roundElement.style.display = 'block';
  blocksElement.style.display = 'block';
  messageElement.style.display = 'block';
  victoryMessageElement.style.display = 'none';
  restartButtonElement.style.display = 'none'; // Ocultar el botón al reiniciar
}


// Agregar evento click al botón de volver a jugar
restartButtonElement.addEventListener('click', restartGame);

// Función para barajar un arreglo utilizando el algoritmo de Fisher-Yates
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cargar la primera ronda al cargar la página
loadNextRound();

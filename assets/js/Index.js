// Función de la pantalla de carga
function showLoader() {
  var loader = document.getElementById('loader');
  loader.style.display = 'block';
}

// Función para ocultar la pantalla de carga y mostrar el contenido
function hideLoader() {
  var loader = document.getElementById('loader');
  loader.style.display = 'none';
}

// Obtener la imagen y la ventana emergente
var img = document.querySelector('.image');
var modal = document.getElementById('myModal');

// Obtener el elemento para cerrar la ventana emergente
var close = document.querySelector('.close');

// Obtener los elementos de texto dentro de la ventana emergente
var text1 = document.querySelector('.image-text');
var text2 = document.querySelectorAll('.image-text')[1];
var text3 = document.querySelectorAll('.image-text')[2];

// Variable para llevar el control de qué texto está siendo mostrado
var currentText = 1;

// Variable para llevar el control del número de clics en la imagen
var clickCount = 0;

// Cuando se hace clic en la imagen, abrir la ventana emergente y mostrar el primer texto
img.onclick = function() {
  modal.style.display = 'block';
  text1.style.display = 'block';
  text2.style.display = 'none';
  text3.style.display = 'none';
  currentText = 1;
  clickCount = 0;
}

// Cuando se hace clic en el botón de cerrar, cerrar la ventana emergente
close.onclick = function() {
  modal.style.display = 'none';
}

// Cuando se hace clic fuera de la ventana emergente, cerrarla
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Cuando se hace clic dentro de la ventana emergente, pasar al siguiente texto o cerrar la ventana después del tercer clic
modal.onclick = function(event) {
  if (event.target != modal) {
    if (currentText == 1) {
      text1.style.display = 'none';
      text2.style.display = 'block';
      text3.style.display = 'none';
      currentText = 2;
      clickCount++;
    } else if (currentText == 2) {
      text1.style.display = 'none';
      text2.style.display = 'none';
      text3.style.display = 'block';
      currentText = 3;
      clickCount++;
    } else if (currentText == 3) {
      modal.style.display = 'none';
    }
  }
}

// Mostrar la pantalla de carga al cargar la página
showLoader();

// Ocultar la pantalla de carga y mostrar el contenido después de un tiempo de carga simulado (3 segundos en este ejemplo)
setTimeout(function() {
  hideLoader();
}, 3000);

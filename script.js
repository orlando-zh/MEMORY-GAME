const totalCards = 12;
const availableCards = ['A', 'K', 'Q', 'J'];
let cards = [];
let selectedCards = [];
let valuesUsed = [];
let currentMove = 0;
let currentAttempts = 0;
let pairsFound = 0;

//sonidos
let click = new Audio('/SONG/probclick.mp3');
let reinicio = new Audio('/SONG/reinicio.mp3');
let error = new Audio('/SONG/error.mp3');
let felicidades = new Audio('/SONG/congrats.mp3');


let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';


// Código para la ventana modal
let modal = document.createElement('div');
modal.setAttribute('id', 'myModal');
modal.setAttribute('class', 'modal');
modal.innerHTML = '<div class="modal-content"><p>¡Felicidades, has encontrado todos los pares!</p><button id="resetModal">Reiniciar</button></div>';
document.body.appendChild(modal);

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function activate(e) {
   if (currentMove < 2) {
      if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active') ) {
         e.target.classList.add('active');
         selectedCards.push(e.target);
         click.play()

         if (++currentMove == 2) {
            currentAttempts++;
            document.querySelector('#stats').innerHTML = currentAttempts + ' intentos';

            if (selectedCards[0].querySelectorAll('.face')[0].innerHTML == selectedCards[1].querySelectorAll('.face')[0].innerHTML) {
               selectedCards = [];
               currentMove = 0;
               pairsFound++; 

               // Mostrar la ventana modal cuando se encuentren todos los pares
               if (pairsFound === totalCards / 2) {
                  modal.style.display = "block";
                  felicidades.play();
               }       
            } else {
               setTimeout(() => {
                  selectedCards[0].classList.remove('active');
                  selectedCards[1].classList.remove('active');
                  selectedCards = [];
                  currentMove = 0;               
               }, 600);
            }
         }
      }
   }
}




function randomValue() {
   let rnd = Math.floor(Math.random() * totalCards * 0.5);
   let values = valuesUsed.filter(value => value === rnd);
   if (values.length < 2) {
      valuesUsed.push(rnd);
   }
   else {
      randomValue();
   }
}


//Esta función devuelve el valor original si es mayor o igual a la longitud del array availableCards, de lo contrario, devuelve el valor del elemento correspondiente en el array availableCards.
function getFaceValue(value) {
   let rtn = value;
   if (value < availableCards.length) {
      rtn = availableCards[value];
   }
   return rtn;
}


document.querySelector('#reset').addEventListener('click', resetGame);
document.querySelector('#resetModal').addEventListener('click', resetGame);


function resetGame() {
   modal.style.display = "none";
   cards = [];
   selectedCards = [];
   valuesUsed = [];
   currentMove = 0;
   currentAttempts = 0;
   pairsFound = 0;
   document.querySelector('#game').innerHTML = '';
   document.querySelector('#stats').innerHTML = '0 intentos';
   reinicio.play()



   for (let i=0; i < totalCards; i++) {
      let div = document.createElement('div');
      div.innerHTML = cardTemplate;
      cards.push(div);
      document.querySelector('#game').append(cards[i]);
      randomValue();
      cards[i].querySelectorAll('.face')[0].innerHTML = getFaceValue(valuesUsed[i]);
      cards[i].querySelectorAll('.card')[0].addEventListener('click', activate);
   }
}


window.onload = resetGame;
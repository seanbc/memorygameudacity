/*****Global variables***********/
const deck = document.querySelector('.deck');

let toggledCards = [];

let moves = 0;

let time = 0;

let clockOff = true;

let clockId;

let matched = 0;

// ***Event Listeners****

// Begins clock once a card has been clicked & isClickValid function criteria are met.
deck.addEventListener('click', event => {
        const clickTarget = event.target;
        if (isClickValid(clickTarget)) {
           if (clockOff) {
             startClock();
             clockOff = false;
           }
        }
});

// If a click is valid:
//   1) toggle between open and close,
//   2) enter card into array,
//   3) check to see if card a match
//   4) Adds a "move" in the move counter function (addMove)
//   5) Checks users score in number of moves
deck.addEventListener('click', event => {
      const clickTarget = event.target;
       if (isClickValid(clickTarget))
       {
            toggleCard(clickTarget);
            addCard(clickTarget);
                if (toggledCards.length === 2) {
                checkMatch ();
          }
          addMove ();
          checkScore ();
        }
});

// ********** Functions **************

// Check if a click is valid
function isClickValid(clickTarget){
        return (
        clickTarget.classList.contains('card')
        && !clickTarget.classList.contains('match')
        && toggledCards.length < 2
        && !toggledCards.includes(clickTarget)
      );
}

// Function to add cards to the toggled cards array after they are clicked
function addCard(clickTarget) {
     toggledCards.push(clickTarget);
}

// Take array of cards from the deck & shuffle
function shuffleDeck() {
     const cardsShuffle = Array.from(document.querySelectorAll('.deck li')); // take array from node list
     const shuffledCards = shuffle(cardsShuffle);
           for (card of shuffledCards) {
             deck.appendChild(card);
         }
 }
shuffleDeck(); // Call function, so deck is shuffled everytime page is refreshed

// Loop through all cards in the deck, resetting each class to "card"
    function resetCards() {
      const cards = document.querySelectorAll('.deck li');
      for (let card of cards) {
        card.className = 'card';
      }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Function to toggle cards between open and closed
function toggleCard(clickTarget) {
      clickTarget.classList.toggle('open');
      clickTarget.classList.toggle('show');
}

// Function to check if cards are a match
// If all card pairs are matched, game will finish
function checkMatch () {
      const TOTAL_PAIRS = 8;

         if (toggledCards[0].firstElementChild.className ===
           toggledCards[1].firstElementChild.className)
           {
             toggledCards[0].classList.toggle('match');
             toggledCards[1].classList.toggle('match');
             toggledCards = [];
             matched++;
               if (matched === TOTAL_PAIRS) {
                     gameOver();
               }
           }
// If cards are not a match, close them again after 1 second
             else {
            setTimeout (() => {
                 toggleCard(toggledCards[0]);
                 toggleCard(toggledCards[1]);
                 toggledCards = [];
             }, 1000);
          }
}

// adds a new move
function addMove () {
      moves++;
      const newMove = document.querySelector('.moves');
      newMove.innerHTML = moves;
}

// checks score and then calls the hidesStar function if applicable
function checkScore () {
      if (moves === 24 || moves === 36) {
        hideStar();
      }
}

// removes a Star when called from the checkScore function
function hideStar () {
      const removeStar = document.querySelectorAll('.stars li');
      for (star of removeStar) {
        if (star.style.display !== 'none') {
              star.style.display = 'none';
              break;
        }
      }
}

function startClock() {
        clockId = setInterval(() => {
        time++;
        console.log(time);
        displayTime();
        }, 1000);
}

// Function to display the clock with time
function displayTime() {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const showTimer = document.querySelector('.clock');
          if (seconds < 10) {
            showTimer.innerHTML = `${minutes}:0${seconds}`;
          } else {
            showTimer.innerHTML = `${minutes}:${seconds}`;
          }  // show time in the correct format
}

// Functions uses clearInterval to stop the clock from counting
function stopClock() {
  clearInterval(clockId);
}

// Calls modal with stats and ends game
function gameOver() {
      stopClock ();
      writeModalStats();
      toggleModal();
  }

// Resets the game to play gagain
function replayGame() {
      resetGame();
      toggleModal();
}

// Create Modal functions
function toggleModal(){
    	const modal = document.querySelector('.modal_background');
    	modal.classList.toggle('hide');
}

// Get modal stats and write to Modal when game finishes
function writeModalStats() {
      const timeStat = document.querySelector('.modal_time');
      const clockTime = document.querySelector('.clock').innerHTML;
      const movesStat = document.querySelector('.modal_moves');
      const starsStat = document.querySelector('.modal_stars');
      const stars = getStars();


      timeStat.innerHTML = `Time = ${clockTime}`;
      movesStat.innerHTML = `Moves = ${moves}`;
      starsStat.innerHTML = `Stars = ${stars}`;
    }

// Get star count which will be written to modal later
function getStars () {
      stars = document.querySelectorAll('.stars li');
      starCount = 0;
      for (star of stars) {
        if (star.style.display !== 'none') {
              starCount++;
        }
      }
      console.log(starCount);
      return starCount;
    }

// ******* Functions to Reset when game finishes *********
// Calls all functions need to reset the game
function resetGame() {
         resetClockandTime ();
         resetMoves();
         resetStars();
         resetCards();
         shuffleDeck();
}

function resetClockandTime () {
         stopClock ();
         clockOff = true;
         time = 0;
         displayTime();
      }

function resetMoves() {
        matched = 0;
        moves = 0;
        document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
        stars = 0;
        const starList = document.querySelectorAll('.stars li');
        for (star of starList) {
          star.style.display = 'inline';
        }
}

// ******* Buttons********

// Modal Cancel button
document.querySelector('.modal_cancel').addEventListener('click', toggleModal);

// Button on Modal to replay game
document.querySelector('.modal_replay').addEventListener('click', replayGame);

// Button to reset game & play again
document.querySelector('.restart').addEventListener('click', resetGame);

/*Declaring global variables at the top so that all functions have access to them. */
let cardList;
let allCards;
let facedCards;
let gameTime;
let gameTimer;
let matches;
let moves;
let modal;
let wait = true;

/*This function adds the open and show classes to cards when clicked and fires the match function. */
const displayCard = function(event) {
/* keeps the user from being able to keep clicking after clicking three cards */
    if (wait) return;

/*keep the user from clicking the same card*/
    if (event.target.classList.contains("show")) return;
/*flips card after the click event listener fires*/
    event.target.classList.add("open", "show");
    /*adds the card to the array of open/faced cards for comparison*/
    facedCards.push(event.target);

    if (facedCards.length === 2) {
        /*when two cards have been selected, wait keeps them from clicking anymore cards.*/
        wait = true;
        /*add to number of moves for the star scores later*/
        moves++;
        /*runs code that keeps track of moves for star rating*/
        setStars();
        /*runs the comparison code*/
        checkMatch();
        /*once all the matches have been made, runs win Game function. setTimeout is used to make sure last card is displayed correctly.*/
        if (matches === 8) setTimeout(winGame, 10);

    } else {
        /*check to see if game has started, if not start game and timer*/
        if (!gameTime) gameTimer = setTimeout(advanceTime, 1000);
    }
}
/*function that manages the display of stars based on number of moves.*/
function setStars() {
    /*Grabs the section in the html that has the moves count and updates it based on moves variable. */
    document.getElementById("moves").textContent = moves;
    /*Conditional used to determine what stars to display depending on the number of moves/2clicks occur. */
    if (moves <= 10) return;
    /*Grabs stars elements so that later the classes can be manipulated to display clear starts instead of full stars. */
    let stars = document.getElementById("stars").children;
    /*If the user has taken over 10 moves/2 clicks, then one star is replaced with a star outline. */
    stars[2].firstElementChild.classList.remove("fa-star");
    stars[2].firstElementChild.classList.add("fa-star-o");
    if (moves <= 20) return;
    /*If the user has taken over 20 moves/2 clicks, then an addional star is repalced with a star outline. */
    stars[1].firstElementChild.classList.remove("fa-star");
    stars[1].firstElementChild.classList.add("fa-star-o");
    if (moves <= 30) return;
    /*If the user takes more than 30 moves/2 clicks, then all three stars are replaced with star outlines. */
    stars[0].firstElementChild.classList.remove("fa-star");
    stars[0].firstElementChild.classList.add("fa-star-o");
}

/*function that sets stars back to default of three stars at beginning of game*/
function resetStars() {
    /*Grabs the children of the section of the html with the stars ID and assigns them to the stars variable. */
    let stars = document.getElementById("stars").children;
    /*Enters 0 for the text content next to moves in the html, to indicate the user hasn't taken any moves in the new game yet. */
    document.getElementById("moves").textContent = 0;
    /*Iterates over the stars in the stars variable and returns them all to stars and not star outlines. */
    for (let star of stars) {
        star.firstElementChild.classList.remove("fa-star-o");
        star.firstElementChild.classList.add("fa-star");
    }
}
/*Removing the open and show classes from flipped cards, so they are no longer flipped. The setTimeout function calls this function after a failed match.*/
function clearFacedCards() {
    for (let card of facedCards) {
        card.classList.remove("open", "show");
    }
    /*This function removes cards from the facedCards array after comparison.*/
    facedCards = [];
    /*Updates the wait variable to false so that users can click cards for the next try*/
    wait = false;
}

/*function that compares the cards for a match and adds the match class if they match and resets the facedCards.*/
function checkMatch() {
    if (facedCards[0].firstElementChild.className == facedCards[1].firstElementChild.className) {
        for (let card of facedCards) {
            card.classList.add("match");
        }
        /*Once match is made facedCards array is emptied. */
        facedCards = [];
        /*Match is added to match total*/
        matches++;
        /*Updates the wait variable to false so that users can click cards for the next try*/
        wait = false;
    } else {
        /*Flips cards that are not a match back over after a short delay. */
        setTimeout(clearFacedCards, 1000);
    }
}
/*This function fires after a user has matched all 8 sets of cards and creates a modal with all the pertinent info. */
function winGame() {
    let container = document.getElementById("container");
    /*Stops the timer. */
    clearTimeout(gameTimer);
    modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = 'You win! Your time is ' + parseInt(gameTime/60) + ":" + ("0" + gameTime%60).substr(-2, 2) + '<input type="button" value="OK">';
    modal.lastElementChild.addEventListener("click", clearModal);
    container.appendChild(modal);
}

/*Removes the modal when user clicks ok and restarts game. */
function clearModal() {
    document.getElementById("container").removeChild(modal);
    startNewGame();
}

/*This function manages the time throughout the game and displays it. */
function advanceTime() {
    gameTime++;
    document.getElementById("time").textContent = parseInt(gameTime/60) + ":" + ("0" + gameTime%60).substr(-2, 2);
    /*The variable gameTimer is used to be able to stop the clock. */
    gameTimer = setTimeout(advanceTime, 1000);
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

/*This function starts the game and shuffles the deck of cards for each play.
 *It displays the cards on the page
 *   - shuffles the list of cards using the provided "shuffle" method below
 *   - loops through each card and create its HTML and
 *   - adds each card's HTML to the page
 */   
function startNewGame() {
    wait = true;
    let cards = [
        "fa-diamond",
        "fa-paper-plane-o",
        "fa-anchor",
        "fa-bolt",
        "fa-cube",
        "fa-leaf",
        "fa-bicycle",
        "fa-bomb",
        "fa-diamond",
        "fa-paper-plane-o",
        "fa-anchor",
        "fa-bolt",
        "fa-cube",
        "fa-leaf",
        "fa-bicycle",
        "fa-bomb"
    ];
    const cardDeck = document.querySelector(".deck");

    shuffle(cards);
    
    cardHTML = ``;

    for (let card of cards) {
        cardHTML += `<li class="card">
                        <i class="fa ${card}"></i>
                     </li>`;
    }
    cardDeck.innerHTML = cardHTML;

/* Create a list that holds all of your cards
 * Used getElementsByClassName as it has a faster load time than querySelector and it produces an html collection instead of a generic node list. 
 * The html collection will only contain any node element, which is more specific than a node list.
 */
    cardList = document.getElementsByClassName('card');

/* Used destructuring here to grab the items in the node list created above and place them into an array 
*so that that array can be looped over and it can be used in the shuffle function.*/
    allCards = [...cardList];
    facedCards = [];

    /* set up the event listener for each card. */
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].addEventListener("click", displayCard);
    }
    document.getElementById("restart").addEventListener("click", startNewGame);
    document.getElementById("time").textContent = "0:00";

    /*Initializing variables that keep track of time, matches, and moves. */
    gameTime = 0;
    matches = 0;
    moves = 0;
    resetStars();
    wait = false;
}
/*Starts game immediately when window loads. */
window.onload = startNewGame();
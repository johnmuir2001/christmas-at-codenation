const cards = document.querySelectorAll('.memory-card');
const score = document.getElementById('score');
const menu = document.getElementById('menu');
const menuScore = document.getElementById('menuScore');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let pairs = 0
let tiles = ['bauble', 'bauble2', 'hat', 'holly', 'santa', 'snowflake', 'tree', 'wreath', 'bauble', 'bauble2', 'hat', 'holly', 'santa', 'snowflake', 'tree', 'wreath']

for(i = 0; i < tiles.length; i++){
    cards[i].dataset.framework = tiles[i]
    cards[i].childNodes[1].src = `./images/${tiles[i]}Tile.jpg`
    cards[i].childNodes[1].alt = tiles[i]
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    }

    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    moves++
    score.textContent = moves

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    pairs++
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    if(pairs == 8){
        menu.style.display = 'flex'
        menuScore.textContent = moves
    }
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
};
shuffle()

cards.forEach(card => card.addEventListener('click', flipCard));

function gameReset(){
    for(i=0; i < cards.length; i++){
        cards[i].addEventListener('click', flipCard)
        cards[i].classList.remove('flip')
    }

    moves = 0
    pairs = 0
    score.textContent = moves
    setTimeout(() => {
        shuffle()
        menu.style.display = 'none'
    }, 500)
}
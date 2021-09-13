
let blackjackGame = {
    'you': { 'scoreSpan': '#your-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const winSound = new Audio('./sounds/swish.m4a')
const lossSound = new Audio('./sounds/aww.mp3')
const dealSound = new Audio('./sounds/cash.mp3')

document.querySelector('#hit-btn').addEventListener('click', blackjackhit);
document.querySelector('#stand-btn').addEventListener('click', dealerLogic);
document.querySelector('#deal-btn').addEventListener('click', blackjackDeal);

function blackjackhit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
        console.log()
    }
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        winSound.play();
    }
}

function blackjackDeal() {

    if (blackjackGame['turnsOver'] === true) {
        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        for (let index = 0; index < yourImages.length; index++) {
            yourImages[index].remove();

        }
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (let index = 0; index < dealerImages.length; index++) {
            dealerImages[index].remove();

        }
        dealSound.play();
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector('#result').textContent = 'Lets play';
        document.querySelector('#result').style.color = 'black';

        blackjackGame['turnOver'] = false;
    }
}

function randomCard() {
    let num = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][num];
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        if ((activePlayer['score'] + blackjackGame['cardMap'][card][1]) <= 21) {
            activePlayer['score'] += blackjackGame['cardMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardMap'][card];
    }


}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjackGame['turnsOver'] = true;
    showResult(compWinner());

}

function compWinner() {

    console.log(YOU['score']);
    console.log(DEALER['score']);
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;
            blackjackGame['wins']++;

        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;

        } else if (YOU['score'] < DEALER['score'] && DEALER['score'] <21 ) {
            winner = DEALER;
            blackjackGame['losses']++;

        } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
            winnner = DEALER;
            blackjackGame['losses']++;
 

        } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
            blackjackGame['draws']++;

        }
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;

    }
    else {
        winner = DEALER;
        blackjackGame['losses']++;
        console.log("hey")
    }


    console.log(blackjackGame['wins']);
    console.log(blackjackGame['losses']);
    console.log(blackjackGame['draws']);
    console.log(winner);
    return winner;
}

function showResult(winner) {
    
    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
            message = 'YOU WON!';
            messageColor = 'green';
            winSound.play();
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            console.log(message);

        } else if (winner === DEALER) {
            message = 'YOU LOST!';
            messageColor = 'red';
            lossSound.play();
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            console.log(message);

        } else {
            message = 'YOU DREW!';
            messageColor = 'yellow';
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            console.log(message);

        }
        document.querySelector('#result').textContent = message;
        document.querySelector('#result').style.color = messageColor;
    }
}
import { wordList } from "./30-word-list.js";
const keyBoardEl= document.querySelector(".keyboard"),
guessesTextEl= document.querySelector(".guesses-text b"),
hangmanImg= document.querySelector(".hangman-box img"),
wordDisplayEl= document.querySelector(".word-display"), 
gameModalEl= document.querySelector(".game-modal"),
hintEl= document.querySelector(".header-hint"),
playAgainBtn= document.querySelector(".play-again");

let currentWord, correctLetters= [], wrongGuessCount= 0;
const maxGuesses= 6,
noSound= new Audio("/sounds/hangman01.mp3"),
hanged= new Audio("sounds/hangman02.mp3"),
correctSound = new Audio("sounds/hangman03.mp3"),
winGame = new Audio("sounds/levelWin.mp3");
let selectedLanguage= "english"

document.getElementById("languageOption").addEventListener("change", e=>{
    selectedLanguage= e.target.value;
    console.log(selectedLanguage);
    getRandomWord();
 });

const wordListLanguage= wordList[selectedLanguage]
console.log(wordListLanguage.length);

function getRandomWord(){
    if(wordList[selectedLanguage]){
        const wordListLanguage= wordList[selectedLanguage];
        if(wordListLanguage.length> 0){
            const { word, hint }= wordListLanguage[Math.floor(Math.random()* wordListLanguage.length)];
            currentWord= word;
            hintEl.textContent= hint;
            // document.querySelector(".hint-text b").textContent= hint;
            resetGame();
            wordDisplayEl.innerHTML= currentWord.split("").map(()=> 
                `<li class="letter"></li>`).join("");
        } else console.error("No words avaliable");
    } else console.error("still error here")
}
getRandomWord();

function initGame(button, clickedLetter){
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach((letter, idx)=>{
            if(letter=== clickedLetter){
                correctLetters.push(letter);
                wordDisplayEl.querySelectorAll("li")[idx].textContent= letter;
                wordDisplayEl.querySelectorAll("li")[idx].classList.add("guessed");
                correctSound.currentTime= 0;
                if(correctLetters.length === currentWord.length) winGame.play();
                else correctSound.play();
            }
        })
    }else{
        wrongGuessCount++;
        hangmanImg.src= `hangmanImg/hangman-${wrongGuessCount}.svg`;
        noSound.currentTime= 0;
        if(wrongGuessCount <= 5) noSound.play();
        else hanged.play();
    }
    button.disabled= true;
    guessesTextEl.textContent= `${wrongGuessCount} / ${maxGuesses}`;
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

function gameOver(isVictory){
    let resultImg= gameModalEl.querySelector("img"),
    textEl= gameModalEl.querySelector("h4"),
    correctWordEl= gameModalEl.querySelector("p b");
    setTimeout(()=> {
        resultImg.src= `hangmanImg/${isVictory ? "victory" : "lost"}.gif`;
        textEl.textContent = `${isVictory ? "Congrats!" : "Game Over!"}`;
        correctWordEl.textContent= `${currentWord}`;
        gameModalEl.classList.add("show");
    }, 300);
}

for(let i=97; i<= 122; i++){
    const button= document.createElement("button");
    button.textContent= String.fromCharCode(i)
    keyBoardEl.appendChild(button);
    button.addEventListener("click", e=> initGame(e.target, String.fromCharCode(i)));
}

function resetGame(){
    const buttonEl= keyBoardEl.querySelectorAll("button");
    correctLetters= [];
    wrongGuessCount= 0;
    gameModalEl.classList.remove("show");
    buttonEl.forEach(btn=> btn.disabled= false);
    hangmanImg.src= `hangmanImg/hangman-${wrongGuessCount}.svg`;
    guessesTextEl.textContent= `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplayEl.innerHTML= currentWord.split("").map(()=> 
        `<li class="letter"></li>`).join("");
}

playAgainBtn.addEventListener("click", getRandomWord);


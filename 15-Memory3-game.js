const picts= [
    "<i class = 'fa fa-tumblr'></i>", 
    "<i class = 'fa fa-instagram'></i>",
    "<i class = 'fa fa-youtube-play'></i>",
    "<i class = 'fa fa-apple'></i>",
    "<i class = 'fa fa-windows'></i>",
    "<i class = 'fa fa-android'></i>",
    "<i class = 'fa fa-reddit'></i>",
    "<i class = 'fa fa-linux'></i>",
]
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.getElementById("board"),
    moves: document.getElementById("moves"),
    mm: document.getElementById("minutes"),
    ss: document.getElementById("seconds"),
    mmWin: document.getElementById("winMinutes"),
    ssWin: document.getElementById("winSeconds"),
    start: document.getElementById("btnStart"),
    winMoves: document.getElementById("winMoves"),
    winTimes: document.getElementById("winTimes")
}

const state= {
    gameStarted: false,
    flippedCards: 0,
    moves: 0,
    seconds: 0,
    minutes: 0,
    intervalId: null
}
function updateStats(){
    state.seconds++;
    if(state.seconds=== 60){
        state.minutes++;
        state.seconds= 0
    }
    let secondString= state.seconds< 10? "0"+ state.seconds: state.seconds;
    let minuteString= state.minutes< 10? "0"+ state.minutes: state.minutes;
    let moveString= state.moves< 10? "0"+ state.moves: state.moves;

    selectors.moves.textContent= `Moves: ${moveString}`;
    selectors.ss.textContent= secondString;
    selectors.mm.textContent= minuteString;
}
function shuffle(array){
    const clonedArray= [...array]
    for(let i=clonedArray.length-1; i> 0; i--){
        const randomIndex= Math.floor(Math.random()* (i+ 1));
        const original= clonedArray[i];
        clonedArray[i]= clonedArray[randomIndex];
        clonedArray[randomIndex]= original;
    }
    return clonedArray;
}

function generateBoard(){
    const items= shuffle([...picts, ...picts]);
    const cards=  items.map(el => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${el}</div>
                </div>`).join("");
    selectors.board.innerHTML= cards;
}
generateBoard();

function flipBackCard(){
    document.querySelectorAll(".card:not(.matched)").forEach(card=>{
        card.classList.remove("flipped")
    })
    state.flippedCards= 0;
}

function flipCard(card){
    if(!state.gameStarted){
        startGame()
    }
    
    state.flippedCards++;
    state.moves++;
   
    if(state.flippedCards <= 2){
        card.classList.add("flipped")
    }
    if(state.flippedCards=== 2){
        const flippedCards= document.querySelectorAll(".flipped:not(.matched)");
        const cardBack1 = flippedCards[0].querySelector(".card-back");
        const cardBack2 = flippedCards[1].querySelector(".card-back");
        
        if(cardBack1.innerHTML === cardBack2.innerHTML){
            flippedCards[0].classList.add("matched");
            flippedCards[1].classList.add("matched");
        } else{
            setTimeout(()=>flipBackCard(), 1000)
        }
        state.flippedCards = 0;
    }
    if(document.querySelectorAll(".card:not(.flipped)").length ===0){
        setTimeout(displayWin, 1000);
    }
}
function displayWin(){
    selectors.boardContainer.classList.add("flipped")
    clearInterval(state.intervalId);
        
    selectors.winMoves.textContent= `With: ${state.moves} moves`
    
    let secondString = state.seconds < 10 ? "0" + state.seconds : state.seconds;
    let minuteString = state.minutes < 10 ? "0" + state.minutes : state.minutes;
    
    if(minuteString === "00"){
        selectors.ssWin.textContent=`${secondString} seconds`;
    } else {
        selectors.ssWin.textContent=`${secondString} seconds`;
        selectors.mmWin.textContent=`${minuteString} minutes`;
    }
}

function startGame(){
   if(state.gameStarted) return;
   state.gameStarted = true;
   state.intervalId= setInterval(updateStats, 1000);
}

function resetGame(){
    clearInterval(state.intervalId);
     // RESET STATE
     state.gameStarted = false;
     state.flippedCards = 0;
     state.moves = 0;
     state.seconds = 0;
     state.minutes = 0;
     state.intervalId = null;
     // RESET UI ELEMENTS
     selectors.moves.textContent = "Moves: 00";
     selectors.ss.textContent = "00";
     selectors.mm.textContent = "00";
     selectors.winMoves.textContent = "";
     selectors.ssWin.textContent = "";
     selectors.mmWin.textContent = "";
     selectors.boardContainer.classList.remove("flipped");
     document.querySelectorAll(".card").forEach(el=>{
        el.classList.remove("flipped", "matched");
     })
    //  GENERATE NEW BOARD
     generateBoard();
 }

document.addEventListener("click", e=>{
    const cardEl= e.target.closest(".card");
    const resetEl= e.target.closest("#btnStart");
    const closeEl= e.target.closest("#close")
    if(cardEl && !cardEl.classList.contains("flipped")){
        flipCard(cardEl);
    } else if(resetEl|| e.target.textContent.trim()=== "refresh"){
        resetGame();
    } else if(closeEl){
        closeGame();
    }
})

function closeGame() {
    clearInterval(state.intervalId);
    state.gameStarted = true;
    state.intervalId = null;
    selectors.moves.textContent = "Moves: 00";
    selectors.ss.textContent = "00";
    selectors.mm.textContent = "00";
    selectors.boardContainer.classList.remove("flipped", "matched");
}
generateBoard();
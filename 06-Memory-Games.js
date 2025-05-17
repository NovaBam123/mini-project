const pics= {
   cars:[
        "/Memory Card Game Images/car1.png",
        "/Memory Card Game Images/car2.png",
        "/Memory Card Game Images/car3.png",
        "/Memory Card Game Images/car4.png",
        "/Memory Card Game Images/car5.png",
        "/Memory Card Game Images/car6.png",
        "/Memory Card Game Images/car7.png",
        "/Memory Card Game Images/car8.png"
    ],
   fruits:[
        "/Memory Card Game Images/fruit1.png",
        "/Memory Card Game Images/fruit2.png",
        "/Memory Card Game Images/fruit3.png",
        "/Memory Card Game Images/fruit4.png",
        "/Memory Card Game Images/fruit5.png",
        "/Memory Card Game Images/fruit6.png",
        "/Memory Card Game Images/fruit7.png",
        "/Memory Card Game Images/fruit8.png"
    ],
   bikes:[
        "/Memory Card Game Images/bike1.png",
        "/Memory Card Game Images/bike2.png",
        "/Memory Card Game Images/bike3.png",
        "/Memory Card Game Images/bike4.png",
        "/Memory Card Game Images/bike5.png",
        "/Memory Card Game Images/bike6.png",
        "/Memory Card Game Images/bike7.png",
        "/Memory Card Game Images/bike8.png"
    ],
};

let wrapperBoardEl= document.getElementById("wrapperBoard"),
           boardEl= document.getElementById("board"),
           movesEl= document.getElementById("moves"),
              ssEl= document.getElementById("seconds"),
              mmEl= document.getElementById("minutes"),
        wonMovesEl= document.getElementById("wonMoves"),
      wonSecondsEl= document.getElementById("wonSeconds"),
      wonMinutesEl= document.getElementById("wonMinutes");
 
let card_1, card_2,
cardMatched= new Audio("/sounds/cardMatched.mp3"),
cardNotMatched= new Audio("/sounds/cardNotMatched.mp3"),
snakeEat= new Audio("/sounds/snakeEat.mp3"),
soundEnd= new Audio("/sounds/successCard.mp3"),
moves= 0,
matchedCard= 0,
seconds= 0,
minutes= 0,
intervalId= null,
cardColor= "rgb(255, 182, 193)"
gameStarted= false,
disableDeck= false;

function updateStats(){
    seconds++
    if(seconds> 60){
        minutes++;
        seconds=0;
    }
    let strSeconds= seconds< 10? "0"+ seconds: seconds,
        strMinutes= minutes< 10? "0"+ minutes: minutes,
        strMoves= moves< 10? "0"+ moves: moves;
    movesEl.textContent= `Moves: ${strMoves}`;
    ssEl.textContent= `: ${strSeconds}`
    mmEl.textContent= `${strMinutes}`
}

function shuffleCard(arr){
    const clonedArr= [...arr]
    for(let i= clonedArr.length-1; i> 0; i--){
        const randomIdx= Math.floor(Math.random()* (i+1));
        const original= clonedArr[i];
        clonedArr[i]= clonedArr[randomIdx];
        clonedArr[randomIdx]= original;
    }
    return clonedArr;
}

let selectPic= "cars";
document.getElementById("choosePic").addEventListener("change", e=>{
    selectPic= e.target.value;
    btnRestart.click();
    generateBoard();
})

// METHOD INNER HTML RENTAN TERHADAP XSS KECUALI DG DOM-PURIFY
function generateBoard(){
    const items= shuffleCard([...pics[selectPic], ...pics[selectPic]]);
    let cards= items.map(el=> 
        `<ul class="cards">
            <li class= "view front-view" id="backView"> 
                <i class="bi bi-question-circle"></i>
            </li>
            <li class= "view back-view"> 
                <img src="${el}"/>
            </li>
        </ul>`).join("") 
    boardEl.innerHTML= cards;
    document.querySelectorAll(".cards").forEach(el=> {
        el.addEventListener("click", flipCard)    
    });
    bgDeckEl= document.querySelectorAll(".back-view");
    bgDeckEl.forEach(card=>{
        card.style.background= `linear-gradient(120deg, black, ${cardColor}, black)`;
    })
}
generateBoard();

function flipCard(e){
    if(!gameStarted && !intervalId) startGame();

    let userClick= e.currentTarget;
    if(userClick !== card_1 && !disableDeck && !userClick.classList.contains("match")){
        userClick.classList.add("flip");
        moves++
        if(!card_1) {
            card_1 = userClick;
            snakeEat.currentTime= 0;
            snakeEat.play();
            return;
        }
        card_2 = userClick;
        snakeEat.currentTime=0;
        snakeEat.play();
        let card_01Img= card_1.querySelector("img").src,
            card_02Img= card_2.querySelector("img").src;
        disableDeck= true;            
        matched(card_01Img, card_02Img);
    }
}

function matched(img1, img2){
    if(img1=== img2){
        matchedCard++
        cardMatched.currentTime= 0;
        setTimeout(()=>cardMatched.play(), 600);
        if(matchedCard=== 8){
            setTimeout(()=>soundEnd.play(), 2500);
            setTimeout(displayWin, 2500);
        };
        setTimeout(()=> {
            card_1.classList.add("match");
            card_2.classList.add("match");
            resetCards();
        }, 600)
    }else{
        setTimeout(()=> {
            card_1.classList.remove("flip");
            card_2.classList.remove("flip");
            cardNotMatched.currentTime= 0;
            cardNotMatched.play();
            resetCards();
        }, 1000);
    }
}
function startGame(){
    if(gameStarted) return;
    gameStarted= true;
    intervalId= setInterval(updateStats, 1000);
}

function displayWin(){
    const winEl= document.querySelector(".win-container");
    clearInterval(intervalId);
    wrapperBoardEl.classList.add("show");
    winEl.classList.add("show");
    if(seconds> 60){
        minutes++;
        seconds=0;
    }
    let strSeconds= seconds< 10? "0"+ seconds: seconds,
    strMinutes= minutes< 10? "0"+ minutes: minutes;
    wonMovesEl.textContent= `${moves} Moves and`;
    wonSecondsEl.textContent= `${strSeconds}s`;
    wonMinutesEl.textContent= `${strMinutes}`;
    intervalId= null;
}

function resetCards(){
    card_1= null;
    card_2= null;
    disableDeck = false;
}

document.getElementById("close").addEventListener("click", e=>{
    wrapperBoardEl.classList.remove("show");
    if(intervalId) clearInterval(intervalId);
    movesEl.textContent= "Moves: 00";
    ssEl.textContent=": 00";
    mmEl.textContent="00";
    moves= 0;
    minutes=0;
    seconds=0;
    gameStarted= false;
    disableDeck= false;
    intervalId= null;
})
//RESTART GAME
document.getElementById("btnRestart").addEventListener("click", e=>{
    movesEl.textContent= "Moves: 00";
    ssEl.textContent=": 00";
    mmEl.textContent="00";
    moves= 0;
    minutes=0;
    seconds=0;
    matchedCard=0;
    clearInterval(intervalId);
    generateBoard();
    gameStarted= false;
    intervalId= null;
})

document.querySelectorAll(".color-box").forEach(el=>{
    el.addEventListener("click", e=>{
        cardColor= e.target.style.backgroundColor;
        bgDeckEl.forEach(card=>{
            card.style.background= `linear-gradient(120deg, black, ${cardColor}, black)`;
        });
    });
});

document.querySelectorAll(".color-box").forEach(el=>{
    el.addEventListener("dblclick", e=>{
        color= e.target.style.backgroundColor;
        boardEl.style.backgroundColor= color;
    })
})

    
//ALTERNATIVE DENGAN MENGGUNAKAN APPENDCHILD DAN CREATEELEMENT
// function generateBoard(){
//     boardEl.innerHTML= "";
//     const items=  shuffleCard([...pics, ...pics]);
//     items.forEach(el=> {
//         const ul= document.createElement("ul");
//             ul.classList.add("cards");
//         const liFront= document.createElement("li");
//             liFront.classList.add("view", "front-view");
//         const icon= document.createElement("i");        
//             icon.classList.add("bi", "bi-question-circle");
//             liFront.appendChild(icon)
        
//         const liBack= document.createElement("li");
//             liBack.classList.add("view", "back-view");
//         const img= document.createElement("img");
//             img.src= el;
//             liBack.appendChild(img)   
        
//         ul.appendChild(liFront);
//         ul.appendChild(liBack);
//         boardEl.appendChild(ul);  
//         document.querySelectorAll(".cards").forEach(el=> {
//             el.addEventListener("click", flipCard)    
//         });  
//     })    
// }
// generateBoard();

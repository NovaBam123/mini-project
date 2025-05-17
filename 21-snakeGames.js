const playBoard= document.querySelector(".play-board"),
scoreEl= document.querySelector(".score"),
popEl= document.querySelector(".popup"),
highScoreEl= document.querySelector(".high-score");

let foodX, foodY;
snakeBody= [],
snakeX= 5, snakeY= 10,
velocityX= 0, velocityY= 0,
score= 0,
gameOver= false,
isConfirmActive= false,
snakeEat= new Audio("sounds/snakeEat.mp3"),
snakeLose= new Audio("sounds/snakeLose.mp3");
let snakeId;

let highScore= localStorage.getItem("High-score") || 0;
highScoreEl.textContent= `High Score: ${highScore}`;

function randomFoodPosition(){
    foodX= Math.floor(Math.random()* 30) +1;
    foodY= Math.floor(Math.random()* 30) +1;
}

function changeDirection(e){
   if(e.key=== "ArrowUp" && velocityY != 1){
        velocityX= 0;
        velocityY= -1;
   }else if(e.key=== "ArrowDown" && velocityY != -1){
        velocityX= 0;
        velocityY= 1;
   }else if(e.key=== "ArrowLeft" && velocityX != 1){
        velocityX= -1;
        velocityY= 0;
   }else if(e.key=== "ArrowRight"  && velocityX != -1){
        velocityX= 1;
        velocityY= 0;
   }
   initGame();
}    

function handleGameOver(){
    clearInterval(snakeId);
    if(gameOver) {
        if(!isConfirmActive){
            createConfirm();
            isConfirmActive= true;
        }
        gameOver= false;
    }
    setTimeout(()=>location.reload(), 15500);
}

function initGame(){
    if(gameOver) {
        snakeLose.play();
        return handleGameOver()
    };
    let htmlMarkup= `<div class="food" style="grid-area: ${foodY} /${foodX}"></div>`;
    if(snakeX=== foodX && snakeY=== foodY){
        snakeEat.currentTime= 0;
        snakeEat.play();
        randomFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore= score >= highScore ? score : highScore;
        
        localStorage.setItem("High-score", highScore);
        scoreEl.textContent= `Score: ${score}`;
        highScoreEl.textContent= `High Score: ${highScore}`;
    }
    
    for(let i= snakeBody.length-1; i> 0; i--){
        snakeBody[i]= snakeBody[i-1];
    }
    snakeBody[0]= [snakeX, snakeY];
    snakeX+= velocityX;
    snakeY+= velocityY;

    if(snakeX<= 0 || snakeX > 30 || snakeY<= 0 || snakeY> 30){
        gameOver= true;
    }

    for(let i=0; i< snakeBody.length; i++){
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} /${snakeBody[i][0]}"></div>`;
        if(i!==0 && snakeBody[0][1]=== snakeBody[i][1] && snakeBody[0][0]=== snakeBody[i][0]){
            gameOver= true;
            console.log(snakeBody[0][1],snakeBody[i][1], snakeBody[0][0],snakeBody[i][0]);
        }
    }
    playBoard.innerHTML= htmlMarkup;
}
randomFoodPosition();
snakeId= setInterval(initGame, 200);
document.addEventListener("keydown", changeDirection);

function removeConfirm(box){
    box.classList.add("hide");
    if(box.timeoutId) clearTimeout(box.timeoutId);
    setTimeout(()=> {
        box.remove();
        isConfirmActive= false;
    }, 500)
}

function onConfirm(){
   const boxEl= document.querySelector(".confirm");
    if(boxEl){
        boxEl.classList.add("hide");
        setTimeout(()=> location.reload(), 500);
    }else{
        location.reload();
    }
}

function createConfirm(){
    const box= document.createElement("div");
    box.className= "confirm"
    box.innerHTML= `<div class="column">
                        <div class="developer">
                        <i class="fa solid fa-triangle-exclamation"></i>
                        <p>Inova-noV says:</p>
                        </div>
                        <span>Game Over! Press Ok to restart...</span>
                        <div class="btnWrapper">
                            <button onclick= "onConfirm()">OK</button>
                        </div>
                    </div>`
    popEl.appendChild(box); 
    box.timeoutId= setTimeout(()=> removeConfirm(box), 15000);               
}
playBoard.addEventListener("touchstart", handleTouch);

function handleTouch(event) {
    const touch = event.touches[0]; // Get the first touch point
    const startX = touch.clientX;  // Get the X coordinate of the touch start
    const startY = touch.clientY;  // Get the Y coordinate of the touch start
    
    let swipeX, swipeY;
  
    playBoard.addEventListener("touchend", handleTouchEnd); // Listen for touch end event
  
    function handleTouchEnd(event) {
      const endTouch = event.changedTouches[0]; // Get the ending touch point
      swipeX = endTouch.clientX - startX;  // Calculate swipe distance in X
      swipeY = endTouch.clientY - startY;  // Calculate swipe distance in Y
      
      // Update velocity based on swipe direction (adjust thresholds as needed)
      if (Math.abs(swipeX) > Math.abs(swipeY) && swipeX > 30) {
        velocityX = 1;
        velocityY = 0;
      } else if (Math.abs(swipeX) > Math.abs(swipeY) && swipeX < -30) {
        velocityX = -1;
        velocityY = 0;
      } else if (Math.abs(swipeY) > Math.abs(swipeX) && swipeY > 30) {
        velocityX = 0;
        velocityY = 1;
      } else if (Math.abs(swipeY) > Math.abs(swipeX) && swipeY < -30) {
        velocityX = 0;
        velocityY = -1;
      }
      
      playBoard.removeEventListener("touchend", handleTouchEnd); // Remove touch end listener
      initGame(); // Call initGame to update snake position based on new velocity
    }
  }
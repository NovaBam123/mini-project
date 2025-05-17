const selectBoxEl = document.querySelector(".select-box"),
xbtnEl= document.querySelector(".playerX"),
oBtnEl= document.querySelector(".playerO"),
playBoardEl= document.querySelector(".play-board"),
allBoxEl= document.querySelectorAll("section span"),
playerEl= document.querySelector(".players"),
resultBoxEl= document.querySelector(".result-box"),
wonTextEl= resultBoxEl.querySelector(".won-text"),
replayBtnEl= resultBoxEl.querySelector(".replayBtn");

window.onload=()=> {
    // for(i=0; i< allBoxEl.length; i++){
    //     allBoxEl[i].setAttribute("onclick", "boxActive(this)");
    // }

    allBoxEl.forEach((box)=> {
        box.addEventListener("click", (e)=> userChoose(e))
    })

    xbtnEl.onclick= ()=> {
        selectBoxEl.classList.add("hide");
        playBoardEl.classList.add("show");
        playerEl.classList.add("playerX");
    }
    oBtnEl.onclick=()=> {
        selectBoxEl.classList.add("hide");
        playBoardEl.classList.add("show");
        playerEl.classList.add("playerO");
    }
}

let playerXIcon= "fas fa-times",
playerOIcon= "far fa-circle",
playerSign= "X",
runBot= true;

function userChoose(e){
    if(playerEl.classList.contains("playerX")){
        e.target.innerHTML= `<i class="${playerXIcon}"></i>`;
        playerEl.classList.remove("active","playerX");
        playerEl.classList.add("active", "playerO");
        playerSign= "X";
        e.target.setAttribute("id", playerSign);
    }else {
        e.target.innerHTML= `<i class="${playerOIcon}"></i>`;
        playerEl.classList.remove("active", "playerO");
        playerEl.classList.add("active", "playerX");
        playerSign= "O"
        e.target.setAttribute("id", playerSign);
    }
    e.target.style.pointerEvents= "none";
    let randomDelayTime= ((Math.random()* 1500) + 200).toFixed();
    setTimeout(()=>{
        bot(runBot);
    }, randomDelayTime);
    const winner= checkWinner()
    if(winner) console.log(winner + " is The winner")
};

function bot(runBot){
    if(runBot){
        let array= [];
        for(let i= 0; i< allBoxEl.length; i++){
            if(allBoxEl[i].childElementCount === 0){
                array.push(i);
            }
        }
        let randomBox = array[Math.floor(Math.random()* array.length)];
        if(array.length > 0){
            if(playerEl.classList.contains("playerO")){
                allBoxEl[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
                playerEl.classList.remove("active", "playerO");
                playerEl.classList.add("active", "playerX");
                
                playerSign= "O";
                allBoxEl[randomBox].setAttribute("id", playerSign);
            }else {
                allBoxEl[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                playerEl.classList.remove("active", "playerX");
                playerEl.classList.add("active", "playerO");
                playerSign= "X";
                allBoxEl[randomBox].setAttribute("id", playerSign);
            }
            allBoxEl[randomBox].style.pointerEvents= "none";
            playBoardEl.style.pointerEvents= "auto";
            const winner= checkWinner();
            if(winner) console.log(winner+ " is The Winner");
        }
    }
};

function checkWinner(){
    const winCombination= [
        ["box1", "box2", "box3"],
        ["box4", "box5", "box6"],
        ["box7", "box8", "box9"],
        ["box1", "box4", "box7"],
        ["box2", "box5", "box8"],
        ["box3", "box6", "box9"],
        ["box1", "box5", "box9"],
        ["box3", "box5", "box7"]
    ]
    for(let i= 0; i< winCombination.length; i++){
        const [a, b, c]= winCombination[i];
        const boxA = document.querySelector(`.${a}`);
        const boxB = document.querySelector(`.${b}`);
        const boxC = document.querySelector(`.${c}`);
        if(boxA && boxB && boxC && boxA.id && boxA.id=== boxB.id && boxA.id=== boxC.id){
            runBot= false;
            bot(runBot)
            setTimeout(()=> {
                playBoardEl.classList.remove("show");
                resultBoxEl.classList.add("display");
            }, 700);
            wonTextEl.innerHTML= `Player <p>${playerSign}</p> won the game!`
            return boxA.id; 
        } 
    }
    let arrayBox= Array.from(allBoxEl)
    let allBoxesFilled= arrayBox.every(box=> box.childElementCount!== 0);
    if(allBoxesFilled){
        runBot = false;
        setTimeout(() => {
            playBoardEl.classList.remove("show");
            resultBoxEl.classList.add("display");
            wonTextEl.innerHTML = `The Game is Draw..!`;
        }, 700);
    }
    return(null)
}

replayBtnEl.addEventListener("click", ()=> {
    location.reload();
})
const startBtnEl= document.querySelector(".start"),
exitBtnEl= document.querySelector(".quit"),
infoBoxEl= document.querySelector(".info-box"),
quizBoxEl= document.querySelector(".quiz_box"),
nextBtnEl= quizBoxEl.querySelector(".next_btn"),
recentQueEl= document.querySelector(".total_que p"), 
optionListEl= document.querySelector(".option_list"),
timeCountEl= quizBoxEl.querySelector(".timer .timer_sec"),
timeLineEl= quizBoxEl.querySelector("header .time_line"),
resultBoxEl= document.querySelector(".result_box");

let que_count= 0,
counterLine,
counter,
timeValue= 15,
widthValue= 0,
userScore= 0;

startBtnEl.addEventListener("click", e=>{
    infoBoxEl.classList.add("active");
});

infoBoxEl.addEventListener("click", e=>{
    let exitBtnEl= e.target.classList.contains("quit");
    let continueEl= e.target.classList.contains("restart")
    if(exitBtnEl) infoBoxEl.classList.remove("active");
    if(continueEl){
        infoBoxEl.classList.remove("active");
        quizBoxEl.classList.add("showQuiz");
        showQuestions(que_count);
        clearInterval(counter);
        startTimer(timeValue);
        clearInterval(counterLine);
        timerLine(widthValue);
    }
});

nextBtnEl.addEventListener("click", e=> {
    if(que_count< questions.length- 1){
        que_count++;
        showQuestions(que_count);
        recentQueEl.textContent= `${1+ que_count}`;
        clearInterval(counter);
        startTimer(timeValue);
        clearInterval(counterLine);
        timerLine(widthValue);
        nextBtnEl.style.display= "none";
    } else{
        quizBoxEl.classList.remove("showQuiz");
        showResultBox();
    }
})

function showQuestions(idx){
    const que_TextEl= document.querySelector(".que_text");
    const optionListEl= document.querySelector(".option_list");

    let que_Tag= `<span>` + questions[idx].numb+ ". "+ questions[idx].question+ `</span>`;
    let optionTag= 
         `<div class="option">`+ questions[idx].options[0]+ `<span></span></div>`   
        +`<div class="option">`+ questions[idx].options[1]+ `<span></span></div>`   
        +`<div class="option">`+ questions[idx].options[2]+ `<span></span></div>`   
        +`<div class="option">`+ questions[idx].options[3]+ `<span></span></div>`   
    
    que_TextEl.innerHTML= que_Tag;
    optionListEl.innerHTML= optionTag;
};

optionListEl.addEventListener("click", e=> {
    let optionEl= e.target.closest(".option"),
    userAns= optionEl? optionEl.textContent.trim(): "",
    correctAns= questions[que_count].answer,
    allOptions= document.querySelectorAll(".option_list .option"),
    
    tickIcon= document.createElement("div");
    tickIcon.classList.add("icon", "tick");
    check= document.createElement("i");
    check.classList.add("fas", "fa-check");  
    tickIcon.appendChild(check);  
    
    crossIcon= document.createElement("div");
    crossIcon.classList.add("icon", "cross");    
    times= document.createElement("i");
    times.classList.add("fas", "fa-times");    
    crossIcon.appendChild(times);

    if(optionEl) {
        if(userAns === correctAns){
            optionEl.classList.add("correct");
            optionEl.appendChild(tickIcon);
            clearInterval(counter);
            clearInterval(counterLine);
            userScore+= 1;
            console.log(userScore);
        }else {
            optionEl.classList.add("incorrect");
            optionEl.appendChild(crossIcon);
            clearInterval(counter);
            clearInterval(counterLine);
        }
        allOptions.forEach(el=> {
            if(el.textContent !== correctAns){
                optionEl.classList.add("correct");
            }
        })
    }
    allOptions.forEach(el=> {
       if(el.textContent.trim()=== correctAns){
            el.classList.add("correct");
            el.appendChild(tickIcon);
       }else if(el.textContent.trim() === userAns) {
            el.classList.add("incorrect")
            el.appendChild(crossIcon);
       }
       el.classList.add("disabled");
    });
    nextBtnEl.style.display= "block";
});

function startTimer(time){
    counter= setInterval(timer, 1000);
    function timer(){
        timeCountEl.textContent= time;
        if(time> 0) {
            time--;
            let timeStr= time< 10 ? "0"+ time: time;
            timeCountEl.textContent= timeStr;
        }else{
            timeCountEl.textContent= "00";
            clearInterval(counter);
        }    
    }        
}

function timerLine(time){
    counterLine= setInterval(timer, 29);
    function timer() {
        time+= 1;
        timeLineEl.style.width= time+ "px";
        if(time > 549) clearInterval(counterLine);
    }
}

function showResultBox(){
    const scoreTextEl= resultBoxEl.querySelector(".score_text");
    infoBoxEl.classList.remove("active");
    quizBoxEl.classList.remove("showQuiz");
    if(userScore >= 3){
        let scoreTag= 
        `<span> Congrats Your score is<p> `+ userScore+`</p> from <p> `+ questions.length +`</p><p>questions</p> </span>`
        scoreTextEl.innerHTML= scoreTag;
    } else {
        let scoreTag= 
        `<span> You Score is Low and got only<p> `+userScore+`</p>out of<p> `+ questions.length+ `</p></span>`;
        scoreTextEl.innerHTML= scoreTag;
    }
    resultBoxEl.classList.add("showResult");
}

resultBoxEl.addEventListener("click", e=> {
    let quitEl= e.target.closest(".quit");
    let restartEl= e.target.closest(".restart");

    if(quitEl) window.location.reload();
    if(restartEl){
        resultBoxEl.classList.remove("showResult");
        infoBoxEl.classList.add("active");
        que_count= 0,
        widthValue= 0,
        userScore= 0,
        timeValue= 15,
        counter,
        counterLine;
        startTimer(timeValue);
        timerLine(widthValue);
        clearInterval(counter);
        clearInterval(counterLine);
        nextBtnEl.style.display= "none";
        recentQueEl.textContent= `${1+ que_count}`
        showQuestions(que_count);
    }
})


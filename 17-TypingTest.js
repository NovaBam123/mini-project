import { paragraphs } from "./17-Paragraph.js";
    let date= document.querySelector(".date p"),
    resultEl= document.getElementById("result"),
      bodyEl= document.querySelector("body"),
      textEl= document.querySelector("main p"),
   mistakeEl= document.querySelector(".mistake span"),
  accuracyEl= document.querySelector(".accuracy span"),
       wpmEl= document.querySelector(".wpm span"),
     tbodyEl= document.querySelector("tbody"),
     inputEl= document.getElementById("inputField"),
        mmEl= document.getElementById("minutes"),
        ssEl= document.getElementById("seconds"),
  btnStartEl= document.getElementById("btnStart"),  
tableContainerEl= document.getElementById("tableContainer"),  
     popupEl= document.getElementById("popup");
  
let charIdx= 0,
    mistakes= 0,
    seconds= 0,
    minutes= 0, 
    afkTime= 0,
    startTime,
    carrotIntervalId,
    carrotEl,
    intervalId,
    keyPressId,
    keyPressTime,
    wpmValues= [],
    color,
    typingSound= new Audio("/sounds/typewriter-soft-click.wav"),
    levelWin= new Audio("sounds/levelWin.mp3"),
    options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true },
    dDay= new Date().toLocaleString("en-US", options)
    date.textContent= dDay;

let language= "english450k";
document.getElementById("languageOption").addEventListener("change", e=> {
    language= e.target.value;
    btnStartEl.click();
    randomText();
})    

document.getElementById("fontOption").addEventListener("change", e=> {
    textEl.style.fontFamily= e.target.value;
    btnStartEl.click();
    randomText();
})

let data= JSON.parse(localStorage.getItem("Typing_Stats") || "[]");

window.addEventListener("load", e=> {
    if(data.length> 0){
        color= data[data.length- 1].color;
        bodyEl.style.backgroundColor= color;
        resultEl.style.background= `linear-gradient(145deg, black, ${color}, black)`;
        tableContainerEl.style.background= color;
    }
})

// GENERATE RANDOM TEXT
function randomText(){
    let randomIdx= Math.floor(Math.random()* paragraphs[language].length);
    textEl.innerHTML= "";
    paragraphs[language][randomIdx].split("").forEach(el=> {
        let span= document.createElement("span");
        span.textContent= el;
        textEl.appendChild(span);
    });
    if(!document.querySelector(".constant-speed")){
        let carrot= document.createElement("span");
        carrot.classList.add("constant-speed");
        textEl.appendChild(carrot);
        carrotEl= carrot;
    }else{
        carrotEl= document.querySelector(".constant-speed");
    }
    
    textEl.querySelectorAll("span")[0].classList.add("animate"); 
    document.addEventListener("keydown", e=> inputEl.focus());
    textEl.addEventListener("click", e=>inputEl.focus());
}
randomText();

function initTyping(){
    const characters= textEl.querySelectorAll("span");
    let typedChar= inputEl.value.split("")[charIdx];
    
    if(charIdx=== 0 && !startTime){
        startTime = new Date();
        keyPressTime= startTime;
        initTimer();
        startCarrotMovement();
        keyPressId= setInterval(()=> {
            let totalCorrectChars=  charIdx- mistakes,
                      timeElapsed= (new Date()- startTime)/ 60000,
                              wpm= (totalCorrectChars/ 5)/ timeElapsed;
            wpmValues.push(wpm);                  
        }, 3000);
    }

    if(typedChar== null){
        charIdx--;
        characters[charIdx].classList.remove("correct", "incorrect");
        }else {
        if(characters[charIdx].textContent === typedChar){
            characters[charIdx].classList.add("correct");
            textEl.querySelectorAll("span")[0].classList.remove("animate");
            carrotEl.classList.add("moving");
            typingSound.currentTime= 0;
            typingSound.play();
        } else {
            characters[charIdx].classList.add("incorrect");
            mistakes++;
        }
        let currentTime= new Date(),
            idleTime= (currentTime- keyPressTime)/ 1000;
        // afkTime += Math.max(0, (currentTime- keyPressTime)/500- 1);
        if(idleTime> 0.35){
            afkTime+= idleTime;
        }
        keyPressTime= currentTime;
        charIdx++;
    }
    if (charIdx < characters.length-1){
        characters.forEach(span=> span.classList.remove("active"));
        characters[charIdx].classList.add("active");
    } else{
        let totalCorrectChars = charIdx - mistakes,
              totalCharsTyped = charIdx,
                      accData = (totalCorrectChars / totalCharsTyped) * 100,
                  timeElapsed = (new Date() - startTime) / 60000,
                          wpm = (totalCorrectChars / 5) / timeElapsed;
        displayResult(wpm, accData);  
    }
    mistakeEl.textContent= mistakes;

    let totalCorrectChars= charIdx-mistakes,
    totalCharsTyped= charIdx,
    accData = ((totalCorrectChars/totalCharsTyped)* 100);
    accuracyEl.textContent= `${accData.toFixed(0)}%`

    let timeElapsed= (new Date() - startTime)/ 60000,
                wpm= ((totalCorrectChars/ 5)/ timeElapsed);
    wpmEl.textContent= wpm.toFixed(0);   
}

function initTimer(){
    intervalId= setInterval(()=> {
        seconds++
        if(seconds >= 60){
            minutes++
            seconds= 0;
        }
        let secondsStr= seconds< 10? "0" + seconds: seconds;
        let minutesStr= minutes< 10? "0" + minutes: minutes;
        mmEl.textContent= minutesStr;
        ssEl.textContent= `:${secondsStr}`;
    }, 1000)
}

// FITUR THEME COLOR
document.querySelectorAll(".color-box").forEach(el=>{
    el.addEventListener("click", e=> {
        color= e.target.style.backgroundColor;
        bodyEl.style.backgroundColor= color;
        resultEl.style.background= `linear-gradient(145deg, black, ${color}, black)`;
        tableContainerEl.style.background= color;
    })
})

function startCarrotMovement() {
    const characters = textEl.querySelectorAll("span");
    const carrot = document.querySelector(".constant-speed");
    let carrotIdx = 0;
    const wpm = 54; // kecepatan yang diinginkan
    const charInterval = (60 / wpm) * 1000 / 5;

    carrotIntervalId = setInterval(() => {
        if (carrotIdx < characters.length) {
            const span = characters[carrotIdx];
            carrot.style.left = span.offsetLeft + "px";
            carrot.style.top = span.offsetTop + 33 + "px";
            carrotIdx++;
        } else {
            clearInterval(carrotIntervalId);
        }
    }, charInterval);
}

// STORING DATA TO STORAGE AND POPUP RESULT TYPING
function displayResult(wpm, accData){
  let consistency= document.querySelector(".end.consistency span"),
        characters= textEl.querySelectorAll("span"),
                ss= document.getElementById("sec"),
                mm= document.getElementById("min"),
            endWpm= document.querySelector(".end.wpm span"), 
          mistakes= document.querySelector(".end.mistakes span"),
               acc= document.querySelector(".end.accuracy span"),
               cpm= document.querySelector(".end.cpm span");
    
    let totalExpectedTime= (new Date()-startTime)/ 1000,
        consistencyScore= Math.max(0, 100-(afkTime/ totalExpectedTime)*100);
    
    levelWin.play();        
    consistency.textContent= `${consistencyScore.toFixed(2)}%`;    
    mm.textContent= mmEl.textContent;
    ss.textContent= ssEl.textContent;
    mistakes.textContent= mistakeEl.textContent;
    endWpm.textContent= wpm.toFixed(2);
    cpm.textContent= charIdx-mistakes.textContent;
    acc.textContent= `${accData.toFixed(2)}%`;
    
    // SAVE TO THE LOCAL STORAGE
    let myData= {
        date: dDay,
       time : `${mm.textContent}${ss.textContent}`,
       wpm  : wpm.toFixed(2),
       cpm  : charIdx-mistakes.textContent,
    mistakes: mistakes.textContent,
    accuracy: `${accData.toFixed(2)}%`,
 consistency: `${consistencyScore.toFixed(2)}%`,
 totalChar  : charIdx,
       color: bodyEl.style.backgroundColor  
    };
    data.push(myData);
    localStorage.setItem("Typing_Stats", JSON.stringify(data));
    
    startTime= null;
    keyPressTime= null;
    afkTime= 0;
    wpmValues= [];
    carrotEl.classList.remove("moving");
    clearInterval(intervalId);
    clearInterval(keyPressId);
    inputEl.value= "";
    inputEl.disable= true;
    popupEl.classList.add("show");
    characters.forEach(span=> span.classList.remove("active"));
}
function totalTimeSpend(){
    let totTime= 0;
    data.forEach(el=> {
        const [minutes, seconds]= el.time.split(":").map(Number);
        totTime+= minutes*60+ seconds;
    });
    let h = Math.floor(totTime/3600);
    let m = Math.floor((totTime% 3600)/ 60);
    let ss= totTime% 60;
    let formattedTime= `${h.toString().padStart("2", 0)}:${m.toString().padStart("2",0)}:${ss.toString().padStart("2",0)}`
    document.getElementById("totalTime").textContent= formattedTime;                   
}

// 10 LAST TEST STATISTIC
function showStats(){
    let totWpm=0, totCpm=0, totMistakes=0, totAccuracy=0, totConsistency=0, totChar=0;
    document.querySelectorAll("tbody tr").forEach(elem=> elem.remove());
    data.forEach((el, idx)=> {
        let rowClass= idx% 2=== 0? "even" : "odd";
        let box= `
            <tr data-id= "${idx}" class= "data-details ${rowClass}">
                <td>${el.date}</td>
                <td>${el.time}</td>
                <td>${el.wpm}</td>
                <td>${el.cpm}</td>
                <td>${el.mistakes}</td>
                <td>${el.accuracy}</td>
                <td>${el.consistency}</td>
                <td>${el.totalChar}</td>
                <td class="icon"><i class="bi bi-trash3"></i></td>
            </tr>`
        tbodyEl.insertAdjacentHTML("afterend", box); 

        totWpm+= parseFloat(el.wpm); 
        totCpm+= el.cpm; 
        totMistakes+= parseInt(el.mistakes); 
        totAccuracy+= parseFloat(el.accuracy); 
        totConsistency+= parseFloat(el.consistency);
        totChar+= el.totalChar;
        let avgWpm= totWpm/ data.length;
        let avgCpm= totCpm/ data.length;
        let avgAccuracy= totAccuracy/data.length;
        let avgConsistency= totConsistency/data.length;
        
        totalTimeSpend();
        document.getElementById("avgWpm").textContent= `${avgWpm.toFixed(2)}`;
        document.getElementById("avgCpm").textContent= `${avgCpm.toFixed(2)}`;
        document.getElementById("totMistakes").textContent= totMistakes;
        document.getElementById("avgAccuracy").textContent= `${avgAccuracy.toFixed(2)}%`;
        document.getElementById("avgConsistency").textContent= `${avgConsistency.toFixed(2)}%`;
        document.getElementById("totalChar").textContent= totChar;
    })
}

// FITUR RESTART, SHOW CHART AND CLOSE POPUP
document.addEventListener("click", e=>{
    let tableShowEl= document.getElementById("tableContainer"),
         elToRemove= e.target.closest(".data-details");   
     
    if(e.target.id=== "chart" || e.target.classList.contains("bi-bar-chart-line")){
        tableShowEl.classList.add("showChart");
        showStats();
    }else if(e.target.id=== "close"){
        popupEl.classList.remove("show");
    }else if(e.target.id=== "tableClose"){
        tableShowEl.classList.remove("showChart")
    }else if(e.target.id=== "btnStart" || e.target.classList.contains("bi-keyboard-fill")){
        clearInterval(intervalId);
        clearInterval(keyPressId);
        clearInterval(carrotIntervalId);
        mmEl.textContent= "00";
        ssEl.textContent= ":00";
        charIdx= 0;
        seconds= 0;
        minutes= 0;
        mistakes= 0;
        wpmValues= [];
        startTime= null;
        accuracyEl.textContent= "0%";
        wpmEl.textContent= "0";   
        mistakeEl.textContent= "0"
        keyPressTime= null;
        afkTime= 0;
        inputEl.value="";
        inputEl.disable= false;
        const characters = textEl.querySelectorAll("span");
        characters.forEach(span => {
            span.classList.remove("correct", "incorrect", "active");
        });
        randomText();
        inputEl.focus();
        if(data.length > 0){
            color= data[data.length- 1].color;
            bodyEl.style.backgroundColor= color;
            resultEl.style.background= `linear-gradient(145deg, black, ${color}, black)`;
            tableContainerEl.style.background= color;
        }
    }else if(elToRemove){
        let icon = e.target.classList.contains("icon"),
        isConfirm= confirm("Delete This Data"),
               id= elToRemove.dataset.id;
        if(icon || e.target.closest(".bi-trash3")){
           elToRemove.classList.add("animate");
           if(!isConfirm) return;
           elToRemove.addEventListener("transitionend", e=>{
                elToRemove.remove();
                data.splice(id, 1);
                localStorage.setItem("Typing_Stats", JSON.stringify(data));
                showStats();
           }, {once: true})
        }
    } else if(e.target.id=== "reset" || e.target.classList.contains("bi-arrow-clockwise")){
        let onConfirm= confirm("Reset All Data?")
        if(!onConfirm) return;
        localStorage.removeItem("Typing_Stats");
        data= [];
        showStats();
    }
})

// SHORTCUT START TEST AND CLOSE POPUP RESULT
document.addEventListener("keydown", e=>{
    if(e.key== "Escape"){
        popupEl.classList.remove("show");
    }
    if(e.key== "Tab") btnStartEl.click();
})
inputEl.addEventListener("input", initTyping);  

document.querySelector(".scrolling").addEventListener("click", e=> {
   let btnToBottom= e.target.closest(".toBottom");
   let btnToTop= e.target.closest(".toTop")
   if(btnToBottom){
        let vh= window.innerHeight; 
        window.scrollBy({
            top: vh* 12.5,
            behavior: "smooth"
        })
   }
   
   if(btnToTop) {
       window.scrollTo({
           top: 0,
           behavior: "smooth"
       });
   };
});

function adjustToTopPosition(){
    const btnToTop= document.querySelector(".scrolling .toTop"),
    windowHeight= window.innerHeight, 
    tableBottom= tbodyEl.getBoundingClientRect().bottom;

    if(tableBottom > windowHeight){
        btnToTop.style.bottom= `${tableBottom - windowHeight + 20}px`;
    } 
    else{
        btnToTop.style.bottom= "-1250vh";
    }
}
window.addEventListener("resize", adjustToTopPosition);
adjustToTopPosition();
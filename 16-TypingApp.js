import { paragraphs } from "./17-Paragraph.js";

let typingText= document.getElementById("typingText").querySelector("p"),
       mistakeEl= document.getElementById("mistake").querySelector("span"),
         inputEl= document.getElementById("inputField"),
         timeEl= document.getElementById("time").querySelector("span b"),
         wpmEl= document.getElementById("wpm").querySelector("span"),
         cpmEl= document.getElementById("cpm").querySelector("span"), 
         btnEl= document.getElementById("btnRestart");

let charIndex= 0,
    mistakes= 0,
    isTyping= 0,
    maxTime= 60,
    timer,
    timeLeft= maxTime,
    language= "english450k";

document.getElementById("languageOption").addEventListener("change", e=>{
   language= e.target.value;
   randomParagraph();
   btnEl.click();
})

function randomParagraph(){
    let randomIdx= Math.floor(Math.random()* paragraphs[language].length);
    typingText.innerHTML= "";
    paragraphs[language][randomIdx].split("").forEach(char=>{
        let span= document.createElement("span");
        span.textContent= char;
        typingText.appendChild(span);
    })
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", e=> inputEl.focus());
    typingText.addEventListener("click", e=> inputEl.focus());
}

function initTyping(){
    const characters= typingText.querySelectorAll("span");
    let typedChar= inputEl.value.split("")[charIndex];
    if(charIndex < characters.length- 1 && timeLeft > 0){
        if(typedChar== null){
            charIndex--;
            characters[charIndex].classList.remove("correct", "incorrect");
        }else{
            if(characters[charIndex].textContent === typedChar){
                characters[charIndex].classList.add("correct");
            }else{
                mistakes++
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++
        }
        characters.forEach(span=> span.classList.remove("active"));
        characters[charIndex].classList.add("active");
        
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm< 0 || !wpm || wpm=== Infinity ? 0: wpm;
    
        mistakeEl.textContent= mistakes;
        wpmEl.textContent= wpm;
        cpmEl.textContent= charIndex - mistakes;
    }else{
        inputEl.value= "";
        clearInterval(timer);
    }
    if(!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping= true;
    } 
}
function initTimer(){
    if(timeLeft> 0){
        timeLeft--;
        timeEl.innerText = timeLeft;
    }else {
        clearInterval(timer);
    }
}

function resetTest(){
    randomParagraph();
    inputEl.value= "";
    clearInterval(timer);
    timeLeft= maxTime;
    timeEl.innerText= timeLeft;
    charIndex= 0;
    mistakes= 0;
    isTyping= 0;
    mistakeEl.textContent= mistakes;
    wpmEl.textContent= 0;
    cpmEl.textContent= 0;
}
randomParagraph();
inputEl.addEventListener("input", initTyping);
btnEl.addEventListener("click", resetTest);
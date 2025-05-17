const cardEl= document.querySelectorAll(".card");
let card01, card02, 
matchedCard= 0,
disableDeck= false;
function flipCard(e){
    let userClick= e.target;
    if(userClick !== card01 && !disableDeck) {
        userClick.classList.add("flip"); 
        if(!card01) {
            card01= userClick;
            return;
        }
            card02= userClick;
            disableDeck= true;
        let card01Img= card01.querySelector("img").src,
            card02Img= card02.querySelector("img").src;   
        matchCards(card01Img, card02Img);             
    } 
}
function matchCards(img1, img2){
    if(img1=== img2){
        console.log(matchedCard);
        matchedCard++;
        if(matchedCard=== 8){
           setTimeout(()=>{
            return shuffleCard()
           }, 1500) ;
        }
        setTimeout(()=>{
            card01.classList.add("matched");
            card02.classList.add("matched");
            card01.removeEventListener("click", flipCard);
            card02.removeEventListener("click", flipCard);
           resetCards();
        }, 800);
    }if(img1!== img2){
        setTimeout(()=>{
            card01.classList.add("shake");
            card02.classList.add("shake");
        }, 800);
        setTimeout(()=>{
            card01.classList.remove("shake", "flip");
            card02.classList.remove("shake", "flip");
            resetCards();
        }, 1200)
    }
}
function resetCards(){
    card01= null;
    card02= null;
    disableDeck= false;
}
function shuffleCard(){
    matchedCard= 0;
    resetCards();
    let arr= [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(()=> Math.random()> 0.5? 1 : -1);
    cardEl.forEach((el, idx)=>{
        el.classList.remove("flip");
        let imgTag= el.querySelector("img");
        imgTag.src= `/Memory Card Game Images/img-${arr[idx]}.png`;
        el.addEventListener("click", flipCard)
    })
}
shuffleCard();
cardEl.forEach(el=>{
    el.addEventListener("click", flipCard)
})


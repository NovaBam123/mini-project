const btnModal= document.querySelector(".show-modal"),
bottomSheetEl= document.querySelector(".bottom-sheet"), 
sheetOverlayEl= bottomSheetEl.querySelector(".sheet-overlay"), 
sheetContentEl= bottomSheetEl.querySelector(".content"),
dragIconEl= bottomSheetEl.querySelector(".drag-icon");

let isDragging= false,
startY, startHeight;

function updateSheetHeight(height){
    sheetContentEl.style.height= `${height}vh`;
    bottomSheetEl.classList.toggle("fullscreen", height=== 100);
}

//DRAGSTOP
dragIconEl.addEventListener("mouseup", e=>{
    isDragging= false;
    bottomSheetEl.classList.remove("dragging");
    let sheetHeight= parseInt(sheetContentEl.style.height);
    sheetHeight < 25? sheetOverlayEl.click(): sheetHeight > 75? updateSheetHeight(100) : updateSheetHeight(50);
})

//DRAG-START
dragIconEl.addEventListener("mousedown", e=>{
    isDragging= true;
    startY= e.pageY ;
    startHeight= parseInt(sheetContentEl.style.height);
    bottomSheetEl.classList.add("dragging");
})

//DRAGGING
dragIconEl.addEventListener("mousemove", e=>{
    if(!isDragging) return;
    const delta= startY- e.pageY;
    const newHeight= startHeight+ delta/ window.innerHeight * 100;
    updateSheetHeight(newHeight);
})

sheetOverlayEl.addEventListener("click", e=> {
    bottomSheetEl.classList.remove("show");
    document.body.style.overflowY= "hidden";
})

btnModal.addEventListener("click", e=> {
    bottomSheetEl.classList.add("show");
    document.body.style.overflowY= "auto";
    updateSheetHeight(50);
})


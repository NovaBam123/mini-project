let popupEl= document.getElementById("popupBox"),
addIcon= document.getElementById("biPlus"),
titleEl= document.querySelector("header p"),
closeIcon= document.getElementById("biClose"),
addText= document.getElementById("addText"),
colorEl= document.querySelectorAll(".color-box"),
inputTxt= document.getElementById("inputText"),
descTxt= document.getElementById("areaText"),
addBtn= document.getElementById("addBtn"), 
wrapperEl= document.querySelector(".wrapper"),
dragablePopupEl= popupEl.querySelector(".popup"),

isUpdate= false;
activeId= null;
let data= JSON.parse(localStorage.getItem("Archive01") || "[]");

colorEl.forEach(el=>{
    let color= el.style.backgroundColor;
    el.addEventListener("click", e=>{
        addText.style.backgroundColor= color;
    })
})
addIcon.addEventListener("click", ()=>{
   popupEl.classList.add("show");
})

biClose.addEventListener("click", e=>{
    popupEl.classList.remove("show");
    addBtn.textContent= "Add Note";
    titleEl.textContent= "Add a New Note";
})

function displayNote(){
    document.querySelectorAll(".note").forEach(elem=> elem.remove());
    data.forEach((el, idx)=>{
        let box= 
        ` <li class="note" style= "background-color: ${el.color}";>
            <div class="details">
                <p>${el.title}</p>
                <span class="span01">${el.content}</span>
            </div>
            <div class="bottom-content">
                <span>${el.time}</span>
                <div class="setting" data-id="${idx}">
                    <i class="bi bi-three-dots"></i>
                    <ul class="menu"
                    data-id="${idx}" 
                    data-title= "${el.title}"
                    data-content= "${el.content}"
                    data-color= "${el.color}"
                    >
                        <li class= "updateNote">
                            <i class="bi bi-pencil"></i>Edit
                        </li>
                        <li>
                            <i class="bi bi-trash3"></i>Delete
                        </li>
                    </ul>
                </div>
            </div>
         </li>`   
        wrapperEl.insertAdjacentHTML("beforeend", box) ;
        });
        inputTxt.value= "";
        descTxt.value= "";
        addText.style.backgroundColor= "#fff";
}
displayNote();
// POP UP MENU
document.addEventListener("click", e => {
    const settingEl = e.target.closest(".setting");
    document.querySelectorAll(".setting.show").forEach(el => {
        if (el !== settingEl) {
            el.classList.remove("show");
        }
    });
    if (settingEl) {
        settingEl.classList.add("show");
    }
});
// EVENT DELEGATION
wrapperEl.addEventListener("click", e=> {
    const menuEl= e.target.closest("ul");
    if(menuEl){
        const noteId= menuEl.dataset.id, 
        title= menuEl.dataset.title,
        content= menuEl.dataset.content, 
        color= menuEl.dataset.color;
        
        if(e.target.closest("i")|| e.target.textContent.trim()=== "Delete"){
            data.splice(noteId, 1);
            localStorage.setItem("Archive01", JSON.stringify(data));
            displayNote();
        }
       
        if(e.target.closest("i")|| e.target.textContent.trim()=== "Edit"){
          isUpdate= true;
          activeId= noteId;
          addIcon.click();
          inputTxt.value= title;
          descTxt.value= content;
          addText.style.backgroundColor= color; 
          addBtn.textContent= "Update Data" 
          titleEl.textContent= "Edit Note";
        }
    }
})

addBtn.addEventListener("click", e=> {
    let titleData= inputTxt.value,
    descData= descTxt.value,
    colorData= addText.style.backgroundColor, 
    months= ["January", "February", "March", "April", "May", "June", "July",
            "August","September", "Oktober", "November", "Desember"]
    time= new Date();
    let year= time.getFullYear();
    let month= months[time.getMonth()];
    let date= time.getDate();
    
    if(titleData=== ""|| descData=== ""){
       alert("Harap diisi...")
    } else {
        let myData= {
            title: titleData,
            content: descData, 
            time: `${month} ${date}, ${year}`,
            color: colorData
        }
        if(activeId!== null){
            data[activeId]= myData
            activeId= null;
            isUpdate= false;
        } else {
            data.push(myData);
        }
        localStorage.setItem("Archive01", JSON.stringify(data));
    }
    displayNote();
    biClose.click();
})

// document.addEventListener("DOMContentLoaded", ()=> {
//     let isDragging= false;
//     let lastOffsetX= 0;
//     let lastOffsetY= 0;
   

//     dragablePopupEl.addEventListener("mousedown", e=> {
//         isDragging= true;
//         let lastOffsetX= e.offSetX;
//         let lastOffsetY= e.offSetY- 100;
//         e.preventDefault();
//     })
//     window.addEventListener("mousemove", e=> {
//         if(!isDragging) return;
//         dragablePopupEl.style.left= e.clientX- lastOffsetX + "px";
//         dragablePopupEl.style.top= e.clientY-  lastOffsetY + "px";
//     })
    
//     window.addEventListener("mouseup", e=> {
//         isDragging= false;
//     });
// });


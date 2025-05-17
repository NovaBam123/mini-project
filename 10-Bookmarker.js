let urlEl= document.getElementById("bookmarkURL"),
colorEl= document.querySelectorAll(".color-box"),
btnSave= document.getElementById("submit"),
listEl= document.getElementById("bookmarkList"),
nameEl= document.getElementById("bookmarkName"),
savedEl= document.getElementById("savedBookmarks"),
errMsgEl= document.querySelector(".errContainer"),
textMsgEl= document.getElementById("textMsg"),
errBoxEl= document.querySelector(".errBox"),
confirmBoxEl= document.getElementById("confirmBox"),

isActive= null,
isUpdate= false;

document.addEventListener("DOMContentLoaded", function() {
    restoreOrder();
});

let data= JSON.parse(localStorage.getItem("Bookmark01")|| "[]"); 
colorEl.forEach(el=>{
   let color= el.style.backgroundColor;
   el.addEventListener("click", e=>{
     urlEl.style.backgroundColor= color;
     nameEl.style.backgroundColor= color;
   })
})

function showList(e){
    document.querySelectorAll(".bookmarkList").forEach(elem=>elem.remove());
    data.forEach((el, idx)=> {
        let newBookmark= 
            `<div class="bookmarkList" 
                style= "background-color: ${el.color};"
                data-id= "${el.id}"
                data-name= "${el.name}" 
                data-url = "${el.url}"
                data-color= "${el.color}"
              >
                <div>
                    <p>${el.name}</p>
                </div>
                <div class="btnContainer">
                    <button>
                        <a class="visit" href=${el.url} target="_blank"> 
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </button>
                    <button> <i class="bi bi-pencil"></i> </button>
                    <button> <i class="bi bi-trash3"></i></button>
                </div>
            </div>`
                        
        savedEl.insertAdjacentHTML("beforeend", newBookmark);
    })
    nameEl.value= "";
    urlEl.value="";
    urlEl.style.backgroundColor= "transparent";
    nameEl.style.backgroundColor= "transparent";
}
showList();

savedEl.addEventListener("click", e=> {
    let bookmarkListEl= e.target.closest(".bookmarkList"),
    editEl= e.target.closest(".bi-pencil"),
    deleteEl= e.target.closest(".bi-trash3");
    if(bookmarkListEl){
        let id= bookmarkListEl.dataset.id,
        name= bookmarkListEl.dataset.name,
        url= bookmarkListEl.dataset.url,
        color= bookmarkListEl.dataset.color;
        if(editEl){
            confirmation("Update This Bookmark?", true, ()=> {
                isActive= id;
                isUpdate= true;
                nameEl.value= name;
                urlEl.value= url
                urlEl.style.backgroundColor= color;
                nameEl.style.backgroundColor= color;
            })
        }
        if(deleteEl){
            confirmation("Delete This Bookmark?", false, ()=> {
                bookmarkListEl.classList.add("animate");
                let bookmark_id= data.findIndex(val=> val.id === id);
                if(bookmark_id> -1) {
                    bookmarkListEl.addEventListener("transitionend", ()=> {
                        bookmarkListEl.remove();
                        data.splice(bookmark_id, 1);
                        localStorage.setItem("Bookmark01", JSON.stringify(data));
                        showMessage("Data Deleted...", true);
                        showList();
                    }, { once: true });     
                }
            })
        } 
    }
});

btnSave.addEventListener("click", e=> {
    e.preventDefault();
    let urlData= urlEl.value;
    let urlName= nameEl.value;
    let timeStamp= Date.now();
    let colorData= urlEl.style.backgroundColor || "transparent";
    let patternURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if(nameEl.value=== "" || urlEl.value=== ""){
            showMessage("Input can't be empty..." );
        } else if(!patternURL.test(urlData)){
            showMessage("The Url is invalid..")
            urlEl.focus();
        } else {
            let myData={
                id: `id-${timeStamp}`,
                name: urlName,
                url: urlData,
                color: colorData
            }
            if(isActive!== null){
                const index= data.findIndex(val=> val.id=== isActive)
                if(index> -1){
                    data[index]= myData;
                    isActive= null;
                    showMessage("Update Data Succed...", false)
                }
            } else {
                data.push(myData)
                showMessage("Data Added Succesfully...", false);
            }    
        localStorage.setItem("Bookmark01", JSON.stringify(data));
    }    
    showList();
    restoreOrder();
});

function showMessage(message, isError= true){
    textMsgEl.textContent= message;
    errMsgEl.classList.add("show");
    if(isError){
        errBoxEl.style.background= "linear-gradient(90deg, gray, #ff0000, gray)";
    } else{
        errBoxEl.style.background= "linear-gradient(90deg, gray, #6495ed, gray)";
    }
    setTimeout(()=>errMsgEl.classList.remove("show"), 3000);
}

function confirmation(message, isEdit= true, onConfirm){
    confirmBoxEl.querySelector("p").textContent= message;
    let yesBtn= document.getElementById("yesBtn"),
        noBtn= document.getElementById("noBtn");
    errMsgEl.classList.add("display");

    if(isEdit){
        yesBtn.onclick= e=>{
            errMsgEl.classList.remove("display")
            onConfirm();
        }
        noBtn.onclick= e=>{
            errMsgEl.classList.remove("display")
        }
    } else{
        yesBtn.onclick= e=>{
            errMsgEl.classList.remove("display");
            onConfirm();
        }
        noBtn.onclick= e=>{
            errMsgEl.classList.remove("display")
        }
    }
}

function saveOrder(){
    const order= [...savedEl.children].map(item=> {
        const bookmarkListEl= item.getAttribute("data-id");
        if(bookmarkListEl) return bookmarkListEl
        return null;
    }).filter(id=> id!== null)
    data= order.map(id=> data.find(item=> item.id=== id));
    localStorage.setItem("My-Order", JSON.stringify(order));
}   

function restoreOrder(){
    const order= JSON.parse(localStorage.getItem("My-Order"));
    if(order && order.length){
        data=  order.map(id=> data.find(item=> item.id=== id));
        showList()
    } else {
        showList();
    }
}

new Sortable(savedEl, {
    animation: 250,
    ghostClass: "ghost", 
    onEnd: function() { saveOrder() } 
})

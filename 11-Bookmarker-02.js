let popupBoxEl= document.getElementById("popupBox"),
    wrapperEl= document.getElementById("wrapper"),
    nameEl= document.getElementById("nameURL"),
    textareaEl= document.getElementById("textarea"),
    titleBar= document.querySelector("header p"),
    saveBtnEl= document.getElementById("saveBtn"),
    calculatorApp= document.querySelector(".calculator-app"),
    data= JSON.parse(localStorage.getItem("Bookmark02") || "[]"),
    filters={
            searchText: "",
            // sortBy: "byCreated"
            sortBy: saveOrder
        },
    isUpdate= false,
    isActive= null;    

document.addEventListener("DOMContentLoaded", function() {
    restoreOrder();
});

document.getElementById("addBtn").addEventListener("click", e=>{
    popupBoxEl.classList.add("show");
})

document.getElementById("filterBy").addEventListener("change", e=> {
    filters.sortBy= e.target.value;
    renderBookmarks(data, filters);
})

document.getElementById("search").addEventListener("input", e=> {
   filters.searchText= e.target.value;
   renderBookmarks(data, filters);
})

// SORTED AND DISPLAYED BOOKMARK AFTER SORTED;
function renderBookmarks(bookmarks, filters){
    let filteredBookmarks= bookmarks.filter(el=>el.name.toLowerCase().includes(filters.searchText.toLowerCase()));
    if(filters.sortBy=== "byCreated"){
        filteredBookmarks.sort((a, b)=> a.createdAt - b.createdAt);
    }else if(filters.sortBy=== "byEdited"){
        filteredBookmarks.sort((a, b)=> a.updatedAt- b.updatedAt);
    }else if(filters.sortBy=== "byAlphabet"){
        filteredBookmarks.sort((a, b)=> {
            if (a.name.toLowerCase()< b.name.toLowerCase()){
                return 1;
            }else if(a.name.toLowerCase()> b.name.toLowerCase()){
                return -1;
            }
        });
    }else if(filters.sortBy=== "saveOrder"){
        const savedOrder= JSON.parse(localStorage.getItem("SortableOrder"));
        filteredBookmarks.sort((a,b)=> savedOrder.indexOf(b.id)- savedOrder.indexOf(a.id))
    }
    
    document.querySelectorAll(".bookmarked").forEach(elem=> elem.remove());
    filteredBookmarks.forEach(el=> {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true },
        createdAt= new Date(el.createdAt).toLocaleString("en-US", options)
        
        let box= `
         <div class="bookmarked" style="background-color:${el.color};"
          data-id="${el.id}">
            <div class="content">
                <p>${el.name}</p>
                <p>${createdAt}</p>
            </div>
            <div class="setting">
                <button><i class="bi bi-gear-wide-connected"></i></button>
                <div class="menu"
                data-id= "${el.id}" 
                data-name= "${el.name}" 
                data-url= "${el.url}"
                data-color= "${el.color}" 
                data-createdAt= "${el.createdAt}"
                data-updateAt= "${el.updateAt}"
                >
                    <span> 
                        <a href="${el.url}" target="_blank">
                            <i class="bi bi-bookmark-star"></i>Visit    
                        </a>
                    </span>
                    <span><i class="bi bi-pencil"></i>Edit</span>
                    <span><i class="bi bi-trash3"></i>Delete</span>
                </div>  
            </div>
        </div>`
        wrapperEl.insertAdjacentHTML("afterbegin", box)
    })
}
renderBookmarks(data, filters);

//MEMBUKA DAN MENUTUP MENU
document.addEventListener("click", e=> {
    let settingEl= e.target.closest(".setting");
    document.querySelectorAll(".setting.show").forEach(el=>{
        if(el!== settingEl) el.classList.remove("show");
    })
    if(settingEl) {
        settingEl.classList.add("show");
    } 
})

wrapperEl.addEventListener("click", e=> {
    let editEl= e.target.classList.contains("bi-pencil"), 
        deleteEl= e.target.classList.contains("bi-trash3"),
        menuEl= e.target.closest(".menu");

    // EDITING And DELETING BOOKMARKED    
    if(menuEl){
        let id= menuEl.dataset.id,
        name= menuEl.dataset.name, 
        url= menuEl.dataset.url, 
        color= menuEl.dataset.color,
        createdAt= menuEl.dataset.createdAt,
        updatedAt= menuEl.dataset.updatedAt;
        if(editEl || e.target.textContent.trim()=== "Edit"){
            popupBoxEl.classList.add("show");
            isUpdate= true;
            isActive= id;
            nameEl.value= name;
            textareaEl.value= url;
            nameEl.style.backgroundColor= color;
            textareaEl.style.backgroundColor= color;
            titleBar.textContent= "Edit for a New URL";
            saveBtnEl.textContent= "Update Data";
        }
        if(deleteEl || e.target.textContent.trim()=== "Delete"){
            let isConfirm= confirm("Delete this Bookmark?")
            if(!isConfirm) return;
            let bookmark_id= data.findIndex(val=> val.id === id)
            if(bookmark_id > -1){
                data.splice(bookmark_id, 1)
                localStorage.setItem("Bookmark02", JSON.stringify(data)); 
                renderBookmarks(data, filters);
            }
        }
    }    
})

// EVEN DELEGASI MENGHANDLE BERBBAGAI EVENT
popupBoxEl.addEventListener("click", e=>{
     
    // MENUTUP POPUP   
    if(e.target.classList.contains("bi-x")) {
        popupBoxEl.classList.remove("show"); 
        nameEl.value= "";
        textareaEl.value= "";
        textareaEl.style.backgroundColor= "#fff";
        nameEl.style.backgroundColor= "#fff";
        popupBoxEl.classList.remove("show");
        titleBar.textContent= "Add a New URL";
        saveBtnEl.textContent= "Save";     
    }
    // MENTUKAN WARNA
    if(e.target.classList.contains("color-box")){
        let color= e.target.style.backgroundColor; 
        nameEl.style.backgroundColor= color;
        textareaEl.style.backgroundColor= color;    
    }
    // MENYIMPAN DATA DILOCAL STORAGE
    if(e.target.classList.contains("saveBtn")){
        e.preventDefault();
        let timeStamp= Date.now(),
            nameData= nameEl.value.trim(),
             urlData= textareaEl.value.trim(),
           colorData= textareaEl.style.backgroundColor || "fff";

        patternURL= /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;            
        
        if(nameData=== "" || urlData=== ""){
            alert("Input can't be empty...")
        }else if(!patternURL.test(urlData)) {
            alert("Url isn't valid...")
        }else {
            myData= {
                       id: `id_${timeStamp}`,
                     name: nameData,
                      url: urlData, 
                    color: colorData,     
                createdAt: timeStamp,
                updatedAt: timeStamp 
            }
           if(isActive!== null){
            const index= data.findIndex(val=> val.id=== isActive)
                if(index> -1){
                    data[index] = myData
                    isActive= null;
                    isUpdate= false;
                }
            }else { data.push(myData) };  
        }
        localStorage.setItem("Bookmark02", JSON.stringify(data)); 
        nameEl.value= "";
        textareaEl.value= "";
        textareaEl.style.backgroundColor= "#fff";
        nameEl.style.backgroundColor= "#fff";
        popupBoxEl.classList.remove("show");
        titleBar.textContent= "Add a New URL";
        saveBtnEl.textContent= "Save";
    }
   renderBookmarks(data, filters); 
})

// CLOSING SCREEN
let screenId;
document.getElementById("toggle").addEventListener("change", e=>{
    const correctPassword = "asdfe"   
    if(e.target.checked){
        const userPassword = prompt("Enter 5 digits password:");
        if(userPassword === correctPassword){
            openScreen();
        } else { 
            alert("incorrect Password") 
            e.target.checked= false;
        }
    } else {
        clearTimeout(screenId);
        createCloseScreen();
        closeScreen();
    } 
})

function openScreen(){
    let screen= document.querySelector(".screen"),
    screenL= screen.querySelector(".screenLeft"),
    screenR= screen.querySelector(".screenRight");

    if(screenL) screenL.classList.add("buka");
    if(screenR) screenR.classList.add("buka");
    screenId = setTimeout(()=> {
        screenL.remove();
        screenR.remove();
    }, 3000);
}

function closeScreen(){
    let screen= document.querySelector(".screen"),
    screenL= screen.querySelector(".screenLeft"),
    screenR= screen.querySelector(".screenRight");
    if(screenL) screenL.classList.add("tutup");
    if(screenR) screenR.classList.add("tutup");
}

function createCloseScreen(){
    const screenEl= document.querySelector(".screen");
    const screenLeft= document.createElement("div");
    screenLeft.classList.add("screenLeft");
    const screenRight= document.createElement("div");
    screenRight.classList.add("screenRight");
    screenEl.appendChild(screenLeft);
    screenEl.appendChild(screenRight);
}
createCloseScreen();

// SIDE NAVIGATION
document.addEventListener("click", e=>{
    // e.preventDefault();
    // e.stopPropagation();
    
    let leftNavigationEl= e.target.closest(".sideNavigation"),
    calculatorIcon= e.target.closest(".bi-calculator");
    closeApp= e.target.closest(".bi-x");
    
    document.querySelectorAll(".sideNavigation.display").forEach(el=>{
        if(el!== leftNavigationEl) el.classList.remove("display");
    })
    if(leftNavigationEl){
        leftNavigationEl.classList.add("display");
    }
    if(calculatorIcon) calculatorApp.classList.add("popup");
    if(closeApp) calculatorApp.classList.remove("popup");
});

function saveOrder(){
    const order= [...wrapperEl.children].map(item=> {
        const menuEl= item.querySelector(".menu");
        if(menuEl) return menuEl.getAttribute("data-id");
        return null;
    }).filter(id=> id!== null);
    
    data= order.map(id=> data.find(item=> item.id=== id));
    console.log(order);
    localStorage.setItem("SortableOrder", JSON.stringify(order));
}

function restoreOrder(){
    const order= JSON.parse(localStorage.getItem('SortableOrder'));
    if(order){
        const orderedBookmark= order.map(id=> data.find(item=> item.id ===id));
        renderBookmarks(orderedBookmark, filters)
    }
}

new Sortable(wrapperEl, {
    animation: 200,
    ghostClass: "ghost", 
    onEnd: function(){ saveOrder() }
})

//COLOR PICKER
const colorPickerEl= document.getElementById("colorChoose"),
        copyBtnEl= document.querySelector(".copyBtn"),
        applyBtnEl= document.querySelector(".applyBtn"),
        navBarEl= document.querySelector(".navBar"),
        popupColorEl= document.querySelector(".popup-color");
        
copyBtnEl.addEventListener("click", e=> {
   const pickedColor= colorPickerEl.value
    navigator.clipboard.writeText(pickedColor)
        .then(()=> {
            showMsg(pickedColor)
            applyBtnEl.dataset.color= pickedColor;
        }).catch(err=> console.log("Failed to Copy:" , err))
})

function showMsg(pick){
    const textEl= popupColorEl.querySelector(".contentMsg span"),
    confirmBtnEl= popupColorEl.querySelector(".confirmBtn"),
    progressEl= popupColorEl.querySelector(".progress-bar");
    let color= pick, counter= 100;
    popupColorEl.classList.add("show");

    popupColorEl.style.background= `linear-gradient(90deg, black, ${color}, black)`;
    confirmBtnEl.style.background= `${color}`;
    textEl.textContent= `Color Copied: ${color}`;
    let popupId= setTimeout(()=> popupColorEl.classList.remove("show"), 5000);

    let progressId= setInterval(()=>{
        if(counter== 0) clearInterval;
        else{
            counter-= 1;
            progressEl.style.width= `${counter}%`;
        }
    }, 45)

    confirmBtnEl.onclick=()=>{
       clearTimeout(popupId);
       clearInterval(progressId);
       popupColorEl.classList.remove("show");
    }
}

applyBtnEl.addEventListener("click", e=> {
    let color= applyBtnEl.dataset.color;
    navBarEl.style.background= color;
})

//SAVE DATA FROM LOCAL STORAGE
const exportBtn= document.getElementById('exportBtn');
const importBtn= document.getElementById('importBtn');
const fileInput= document.getElementById('fileInput');
const deleteBtn= document.getElementById('deleteBtn');


//EXPORT DATA
exportBtn.addEventListener('click', ()=>{
    const data= {};
    const keys= ["Bookmark02","SortableOrder", "MyOrder"];
    keys.forEach(key=> {
        const value= localStorage.getItem(key);
        if(value){
            data[key]= value;
        }
    })
    if (Object.keys(data).length === 0) {
        alert("Tidak ada data yang bisa diekspor.");
        return;
    }
    const blob= new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    })

    // Cek apakah browser mendukung msSaveBlob (untuk Edge lama di HP)
    if(window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, 'dataAv.json');
        alert('Transfer Berhasil...!');
    }else {
        const link= document.createElement('a');
        link.href= URL.createObjectURL(blob);
        link.download= 'dataAv.json';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(()=> alert('Transfer Berhasil..!'), 100);
    }
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
})

// IMPORT DATA
importBtn.addEventListener('click', () => {
    console.log("Tombol Import diklik!");
    if (fileInput.files.length === 0) {
        alert('Silahkan pilih file!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            alert('Import Berhasil..!');
        } catch (err) {
            alert(`Oops, Gagal import! ${err.message}`);
        }
    };

    reader.readAsText(file);
});

// DELETE DATA
deleteBtn.addEventListener('click', () => {
    let konfirmasi = confirm('Peringatan! Seluruh data localStorage akan dihapus?');
    if (konfirmasi) {
        localStorage.clear();
        alert('Data berhasil dihapus!');
    }
});


// importBtn.addEventListener('click', ()=> {
//     if(fileInput.files.length=== 0){
//         alert('Silahkan pilih file.');
//         return;
//     }
//     const file= fileInput.files[0];
//     const reader= new FileReader();
//     reader.onload= (e)=> {
//         try {
//            const data= JSON.parse(e.target.result);
//            Object.keys(data).forEach(key=> {
//               localStorage.setItem(key, data[key]);
//            })
//            alert('Import Berhasil..!')
//         }catch(err) {
//             alert(`Oops, Gagal import! ${err.message}`);
//         }
//     }
//     reader.readAsText(file);
// })

// deleteBtn.addEventListener('click', ()=> {
//     let konfirmasi= confirm('Peringatan! seluruh data localStorage akan dihapus?')
//     if(konfirmasi){
//         localStorage.clear();
//     }else{
//         return;
//     }
// });





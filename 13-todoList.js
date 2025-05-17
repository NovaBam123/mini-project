let wrapper = document.getElementById("wrapper"),
xEl= document.getElementById("biClose");
popupBoxEl= document.getElementById("popupBox"), 
textarea= document.getElementById("textarea");
titleBar= document.querySelector("header p");

isActive= null,
isUpdate= false;
let data= JSON.parse(localStorage.getItem("Notes02") || "[]");
const filters= {
    searchText: "", 
    sortBy: "alphabetical"
}

document.getElementById("createBtn").addEventListener("click", e=> {
    popupBoxEl.classList.add("show");
})

xEl.addEventListener("click", e=> {
    popupBoxEl.classList.remove("show");
    titleBar.textContent= "Add a New Note";
    addNote.textContent= "Add Note";
    textarea.style.backgroundColor= "";
    textarea.value= "";
})

document.querySelectorAll(".color-box").forEach(el=>{
    let color= el.style.backgroundColor;
    el.addEventListener("click", e=>{
      textarea.style.backgroundColor= color || "#fff"; 
    })
})

document.getElementById("search-text").addEventListener("input", e=> {
    filters.searchText= e.target.value.toLowerCase()
    renderNotes(data, filters);
});

document.getElementById("filter-by").addEventListener("change", e=> {
    filters.sortBy = e.target.value;
    renderNotes(data, filters);
})

function renderNotes(notes, filters) {
    let filteredNotes= notes.filter(el=> el.note.toLowerCase().includes(filters.searchText))
    if(filters.sortBy === "alphabetical"){
        filteredNotes.sort((a, b)=> {
            if (a.note.toLowerCase()< b.note.toLowerCase()){
                return 1;
            }else if(a.note.toLowerCase()> b.note.toLowerCase()){
                return -1;
            }
        })
    } else if(filters.sortBy === "byCreated"){
        filteredNotes.sort((a, b)=> new Date(b.createdAt)- new Date(a.createdAt));
    } else if(filters.sortBy === "edited"){
        filteredNotes.sort((a, b)=> {new Date(b.updateAt)- new Date(a.updateAt)
        })
    } 
    document.querySelectorAll(".notes").forEach(el=>el.remove())
    filteredNotes.forEach((el, idx)=> {
        let box = `
        <div id="notes" class="notes" style="background-color: ${el.color}";>
            <div class="content">
                <p>${el.note}</p>
                <p>${el.createdAt}</p>
            </div>
            <div class="setting">
                <i class="bi bi-three-dots-vertical"></i>   
                <div class="menu"
                    data-id= "${el.id}" 
                    data-note= "${el.note}"
                    data-color= "${el.color}"
                    data-create= "${el.createdAt}"
                    data-update= "${el.updateAt}"
                >
                    <span><i class="bi bi-pencil"></i>Edit</span>
                    <span><i class="bi bi-trash3"></i>Delete</span>
                </div>
            </div>
        </div>
        `
        wrapper.insertAdjacentHTML("afterbegin", box);
    })
}
renderNotes(data, filters);

document.addEventListener("click", e=> {
    let settingEl= e.target.closest(".setting");
    document.querySelectorAll(".setting.show").forEach(el=>{
        if(el!== settingEl) el.classList.remove("show");
    })
    if(settingEl) {
        settingEl.classList.add("show");
    } 
})

wrapper.addEventListener("click", e=>{
    let menu= e.target.closest(".menu"),
        delEl= e.target.closest(".bi.bi-trash3"),
        editEl= e.target.closest(".bi.bi-pencil");
        
        // DELETE NOTE
        if(menu){
        let noteId= menu.dataset.id, 
        note= menu.dataset.note,
        color= menu.dataset.color, 
        createdAt= menu.dataset.create,
        updateAt= menu.dataset.update;
        if(delEl || e.target.textContent.trim() === "Delete") {
            let noteIndex= data.findIndex(note=>note.id === noteId);
            if(noteIndex > -1){
                data.splice(noteIndex, 1);
                localStorage.setItem("Notes02", JSON.stringify(data));
                renderNotes(data, filters);
                console.log("deletedNoted:", noteId)
            }
        }
        // UPDATE NOTE
        if(editEl || e.target.textContent.trim() === "Edit") {
            popupBoxEl.classList.add("show");
            isUpdate = true;
            isActive= noteId;
            textarea.value= note;
            textarea.style.backgroundColor= color || "#fff";
            titleBar.textContent= "Edit Note";
            addNote.textContent= "Update Note";
        } 
    }
});

document.getElementById("addNote").addEventListener("click", e=> {
    e.preventDefault();
    const timeStamp= Date.now(), 
    id= `note-${timeStamp}`;
    textData= textarea.value,
    colorData= textarea.style.backgroundColor,
    createdAt= timeStamp, 
    updateAt= timeStamp,
    options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true },
    noteTimeAdding = new Date(createdAt).toLocaleString("en-US", options);
    
    if(textData === ""){
        alert("Note harap diisi..")
    } else {
        myData= {
            id: id,
            note: textData,
            color: colorData,
            createdAt: noteTimeAdding,
            updateAt: timeStamp
     };
     if(isActive !== null) {
       const noteIndex= data.findIndex(note=> note.id=== isActive);
       if(noteIndex > -1){
            data[noteIndex]= myData;
           isActive= null;
           isUpdate= false;
       }
     } else {
         data.push(myData);
     }
     localStorage.setItem("Notes02", JSON.stringify(data));
    }
    renderNotes(data, filters);
    xEl.click();
})



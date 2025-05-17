const addBox= document.querySelector(".add-box"),
popupBox= document.querySelector(".popup-box"),
closeIcon= document.querySelector("header i"),
addTitle= document.querySelector("header p")
addBtn= document.querySelector("button"),
input= document.querySelector("input"),
textarea= document.querySelector("textarea");

let months= ["Jan", "Feb", "March", "April", "May", "June", 
            "July", "August", "Sept", "Okt", "Nov", "Dec"]

let notes= JSON.parse(localStorage.getItem("archive02") || "[]");
let isUpdate= false, 
updateId= null;

addBox.addEventListener("click", e=> {
    input.focus();
    addBtn.textContent= "Add Note"
    addTitle.textContent= "Add new Note"
    popupBox.classList.add("show");
})
closeIcon.addEventListener("click", e=> {
    isUpdate= false;
    input.value= "";
    textarea.value= "";
    popupBox.classList.remove("show");
})
textarea.addEventListener("keydown", e=>{
    if(e.key === "Enter") addBtn.click();
})

function showNotes(){
  document.querySelectorAll(".note").forEach(elem=>elem.remove());  
  notes.forEach((note, idx)=>{
    let liTag= ` <li class="note">
            <div class="details">
                <p>${note.title}</p>
                <span>${note.desc}</span>
            </div>
            <div class="bottom-content">
                <span>${note.date}</span>
                <div class="settings">
                    <i onclick="showMenu(this)" class="bi bi-three-dots"></i>
                    <ul class="menu">
                        <li onclick= "editNote(${idx}, '${note.title}', '${note.desc}')" ><i class="bi bi-pencil"></i>Edit</li>
                        <li onclick="deleteNote(${idx})" ><i class="bi bi-trash3"></i>Delete</li>
                    </ul>
                </div>
            </div>
        </li>`
    addBox.insertAdjacentHTML("afterend", liTag);    
  })
}
showNotes();

function showMenu(elem){
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e=> {
        if(e.target.tagName !== "I" || e.target !== elem){
            elem.parentElement.classList.remove("show");
        }
    })
}

function deleteNote(noteId){
    let isConfirm= confirm("Delete this Note?")
    if(!isConfirm) return;
    notes= notes.filter((_, idx)=> idx !== noteId )
    localStorage.setItem("archive02", JSON.stringify(notes));   
    showNotes();
    // notes.splice(noteId, 1) => cara lain untuk mengahapus note.
}

function editNote(noteId, title, desc){
    isUpdate= true;
    updateId= noteId
    addBox.click();
    input.value= title;
    textarea.value= desc;
    addBtn.textContent= "Update Note"
    addTitle.textContent= "Edit Note"
}

addBtn.addEventListener("click", e=> {
    let noteTitle= input.value;
    let noteDesc= textarea.value;
    let time= new Date()
    let year = time.getFullYear();
    let month= months[time.getMonth()]
    let date= time.getDate()

    let noteInfo= {title: noteTitle, desc: noteDesc, 
            date: `${month} ${date}, ${year}`};
    if(updateId !== null){
        notes[updateId]= noteInfo;
        updateId = null
        isUpdate= false;
    } else {
        notes.push(noteInfo);
    }      
    localStorage.setItem("archive02", JSON.stringify(notes));   
    closeIcon.click();
    showNotes();
})

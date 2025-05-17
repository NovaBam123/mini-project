//NOTE CLASS
class Note{
    constructor(id, title, content, color){
        this.id= id;
        this.title= title;
        this.content= content;
        this.color= color;
    }
}
class UI{
    static refreshNotes(){
        document.querySelector("#note-list").innerHTML= "";
        const notes= Store.getNotes();
        let i = notes.length;
        for (let i = notes.length - 1; i >= 0; i--) {
            UI.addNoteToList(notes[i]);
        }
        UI.updateId();
    }
    static addNoteToList(note){
        const list= document.getElementById("note-list");
        let card= document.createElement("div");
        card.classList= `card text-white bg-primary mb-3`;
        card.innerHTML= 
            `<div class="card-header">
                <span>${note.title}</span>
                <i class="fa-solid fa-trash" noteid= "${note.id}"></i>
                <i class="fa-solid fa-pen-to-square" noteid="${note.id}"></i>
            </div>
            <div class= "card-body ${note.color} ${note.color==='bg-white' ? 'text-dark': ''}">
                <p class= "card-text">${note.content}</p>
            </div>`;
            list.appendChild(card);
    }
    static clearFields(){
        document.getElementById("title").value= "";
        document.getElementById("content").value= "";
        UI.updateId();
    }

    // UPDATING ID document.getElementById("noteid").value
    // = (Store.getLastNote()==undefined)? 1: Store.getLastNote().id+1; 
    static updateId() {
        let lastNote= Store.getLastNotes();
        let id= 1;
        if(lastNote !==undefined){
            id= lastNote.id+1;
        }
        document.getElementById("noteid").value= id;
    }
};
// STORING DATA CLASS
class Store {
    static getNotes() {
        let notes; 
        if(localStorage.getItem("notes")=== null){
            notes= [];
        } else {
            notes = JSON.parse(localStorage.getItem("notes"));
        }
        return notes;
    }
    static getNote(id){
        return Store.getNotes().find(note=> note.id === id );
    }

    static getLastNotes(){
        let notes= Store.getNotes();
        return notes[notes.length-1];
    }

    static addNote(note){
        if(Store.getNote(note.id) !== undefined){
            Store.removeNote(note.id)
        }
        const notes= Store.getNotes();
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes))
    }
    static removeNote(id){
        let notes= Store.getNotes();
        notes.forEach((note, index) => {
            if(note.id == id) {
                notes.splice(index, 1)
            }
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}
document.addEventListener('DOMContentLoaded', ()=>UI.refreshNotes());

// EVENT DISPLAY
document.getElementById("note-form").addEventListener("submit", e=> {
    e.preventDefault();
    const title= document.getElementById("title").value;
    const content= document.getElementById("content").value; 
    const id= parseInt(document.querySelector("#noteid").value);
    const color= document.querySelector(".swatches .active").classList[0];
    const submit= document.getElementById("submit");
    
    if(title=== "" || content=== ""){
        alert("please fill in all fields")
    } else{
        const note= new Note(id, title, content, color);
        if(submit.value === "Edit Note"){
            let confirmation= confirm("Are you sure editing this Note?");
            if(confirmation){
                Store.removeNote(id);
                Store.addNote(note);
                UI.refreshNotes();
                submit.value= "Add Note";
                submit.classList.remove("edit-mode");
            }
        } else {
            let confirmation= confirm("add Note?")
            if(confirmation){
                UI.addNoteToList(note);
                Store.addNote(note);
            }
        }
        UI.clearFields();
        UI.refreshNotes();
    }
})

document.getElementById("note-list").addEventListener("click", e=> {
    if(e.target.classList.contains("fa-trash")){
        const noteid= parseInt(e.target.getAttribute("noteid"))
        const confirm= confirm("Are you sure want to remove?")
        if(!confirm) return;
        Store.removeNote(noteid);
        UI.refreshNotes();
    }
    if(e.target.classList.contains("fa-pen-to-square")){
        document.getElementById("title").value= e.target.parentElement.firstElementChild.innerText.trim();
        document.getElementById("content").value= e.target.parentElement.nextElementSibling.querySelector(".card-text").innerText.trim();
        document.getElementById("noteid").value= e.target.getAttribute("noteid")
    };
})

document.querySelector(".swatches").addEventListener("click", e=>{
    if(e.target.classList.contains("swatch")){
        document.querySelector(".swatch.active").classList.remove("active");
        e.target.classList.add("active");
        const bgColor= window.getComputedStyle(e.target).backgroundColor
        content.style.backgroundColor=bgColor;
    }
})

document.getElementById("note-list").addEventListener("click", e=> {
    const faPen= e.target.classList.contains("fa-pen-to-square");
    const submit= document.getElementById("submit");
    if(e.target.classList.contains("fa-trash")){
        let confirmation= confirm("Are you sure to delete this note?")
        console.log("Confirmation result:", confirmation);
        const noteid= parseInt(e.target.getAttribute("noteid"))
        if(!confirmation) return;
            Store.removeNote(noteid);
            UI.refreshNotes();
    }
    if(faPen){
        document.getElementById("title").value= e.target.parentElement.firstElementChild.innerText.trim();
        document.getElementById("content").value= e.target.parentElement.nextElementSibling.querySelector(".card-text").innerText.trim();
        document.getElementById("noteid").value= e.target.getAttribute("noteid")
        if (submit.value === "Add Note"){
            submit.value = "Edit Note";
            submit.classList.add("edit-mode");
        } 
    };
})

document.querySelector(".swatches").addEventListener("click", e=>{
    if(e.target.classList.contains("swatch")){
        document.querySelector(".swatch.active").classList.remove("active");
        e.target.classList.add("active");
        const bgColor= window.getComputedStyle(e.target).backgroundColor
        content.style.backgroundColor=bgColor;
    }
})
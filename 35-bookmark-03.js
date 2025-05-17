const btnSave= document.getElementById("btnSave"),
nameEl= document.getElementById("inputName"),
urlEl= document.getElementById("inputURL"),
colorEl= document.querySelectorAll(".color-box"),
tbodyEl= document.querySelector("tbody"),
messageEl= document.getElementById("errMessage"),
msgContainer= document.querySelector(".errorContainer"),
closeEl= document.querySelector(".errorContainer .bi-x"),
h3El= document.querySelector("h3");

let data= JSON.parse(localStorage.getItem("Bookmark03") || "[]");
let activeId= null;
let isUpdate= false; 

closeEl.addEventListener("click", e=> {
    messageEl.classList.remove("show")
})

function showMessage(message, isError= true){
    h3El.textContent= message;
    if(isError){
        messageEl.classList.add("show");
        msgContainer.style.background= "linear-gradient(90deg, gray, #ff0000, gray)";
    } else {
        messageEl.classList.add("show");
        msgContainer.style.background= "linear-gradient(90deg, gray, #6495ed, gray)";
    }
}

colorEl.forEach(el=>{
    let color= el.style.backgroundColor;
    el.addEventListener("click", e=>{
        nameEl.style.backgroundColor= color;
        urlEl.style.backgroundColor= color;
        console.log(color)
    })
})
function clearInput(){
    btnSave.textContent= "ADD";
    nameEl.value= "";
    urlEl.value= "";
    nameEl.style.backgroundColor= "transparent";
    urlEl.style.backgroundColor= "transparent";
}

function display(){
    document.querySelectorAll("#trData").forEach(elem=>elem.remove());
    data.slice().reverse().forEach((el, idx)=>{
        originalId= data.length-1-idx;
        let box= `
             <tr class="trData" id="trData" style="background-color: ${el.color}" data-id="${originalId}";>
                <td class="index">${idx +1}</td>
                <td class="website-name">${el.name}</td>
                <td class="date">${el.date}</td>
                <td class="icon">
                    <a href="${el.url}" target="_blank">
                        <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                </td>
                <td class="icon"  onclick= "edit(${originalId}, '${el.name}', '${el.url}', '${el.color}')"> <i class="bi bi-pencil"></i></td>
                <td class="icon" onclick= delData(${originalId})><i class="bi bi-trash3"></i></td>
             </tr>`
        tbodyEl.insertAdjacentHTML("beforeend", box)
    })
    clearInput()    
}
display();

function delData(dataId){
    let isConfirm= confirm("Delete This Data?"),
    elToDel= document.querySelector(`tr[data-id= "${dataId}"]`);
    elToDel.classList.add("animate");

    elToDel.addEventListener("transitionend", ()=>{
        if(isConfirm) {
            elToDel.remove()
            data.splice(dataId, 1);
            localStorage.setItem("Bookmark03", JSON.stringify(data));
            display();
        };
    }, {once: true})
}

function edit(dataId, name, url, color){
    btnSave.textContent= "UPDATE";
    activeId= dataId;
    isUpdate= true;
    nameEl.value= name;
    urlEl.value= url;
    nameEl.style.backgroundColor= color;
    urlEl.style.backgroundColor= color;
}

btnSave.addEventListener("click", e=>{
    e.preventDefault();
    let nameData= nameEl.value;
    let urlData= urlEl.value;
    let colorData= nameEl.style.backgroundColor || "#fff";
    
    let year= new Date().getFullYear();
    let month= new Date().getMonth() + 1;
    month = month< 10 ? "0" + month: month;
    let day= new Date().getDate();
    
    let patternURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if(nameData=== ""|| urlData=== ""){
        showMessage("Harap diisi...", true)
        setTimeout(()=>closeEl.click(), 5200);
    } else if(!patternURL.test(urlData)){
        showMessage("URL tidak valid...")
        setTimeout(()=>closeEl.click(), 5200);
    } else {
        dataInfo={
            name: nameData, 
            date: `${day}/${month}/${year}`,
            url: urlData,
            color: colorData
    } 
    if(activeId !== null){
        data[activeId]= dataInfo
        showMessage("Data diupDate...", false);
        setTimeout(()=>closeEl.click(), 5200);
        activeId= null;
        isUpdate= false;
    } else{
        data.push(dataInfo);
        showMessage("Data Ditambah...", false);
        setTimeout(()=>closeEl.click(), 5200);
    }
        localStorage.setItem("Bookmark03", JSON.stringify(data));
    }
    display();
})
    
function sortBookmark(data, sortBy) {
    if(sortBy === "alphabetical"){
        return data.sort((a, b)=> {
            if (a.name.toLowerCase()< b.name.toLowerCase()){
                return 1;
            }else if(a.name.toLowerCase()> b.name.toLowerCase()){
                return -1;
            }else return 0
        })
    } else if(sortBy=== "byCreated"){
        return data.sort((a, b)=> {
            const [dayA, monthA, yearA] = a.date.split('/').map(Number);
            const [dayB, monthB, yearB] = b.date.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateA - dateB;
        })
    } else { return data };
}

document.getElementById("filterBy").addEventListener("change", e=> {
    const sortBy= e.target.value;
    const sortedData= sortBookmark(data, sortBy);
    display(sortedData);
})
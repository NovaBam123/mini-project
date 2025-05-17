const fileBrowseBtn= document.querySelector(".file-browse-button"),
fileListEl = document.querySelector(".file-list"),
fileBrowseInput= document.querySelector(".file-browse-input"), 
dotWrapperEl= document.querySelector(".dot-wrapper"),
fileUploadBox= document.querySelector(".file-upload-box"),
fileCompletedStatus= document.querySelector(".file-completed-status");

let totalFiles= 0;
let completedFiles= 0;

const uniqueID= 0;
const numDots = 6* 6; 
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dotWrapperEl.appendChild(dot);
        }
const dotEl= document.querySelectorAll(".dot");

function createFileItemHTML(file, uniqueID){
    const {name, size} = file;
    const extension= name.split(".").pop();
    return `<li class="file-item" id="file-item-${uniqueID}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                            <h5 class="file-name">${name}</h5>
                            <div class="file-info">
                                <small class="file-size">4 MB / ${(size/ 1024).toFixed(1)}kb</small>
                                <small class="file-divider">•</small>
                                <small class="file-status">Uploading...</small>
                            </div>
                        </div>
                        <button class="cancel-button">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="file-progress-bar">
                        <div class="file-progress"></div>
                    </div>
                </div>
            </li>`
}
function handleSelectedFiles([...files]){
    if(files.length=== 0) return;
    totalFiles+= files.length;

    files.forEach((file, idx)=> {
        const uniqueID= Date.now()+ idx;
        const fileItemHTML= createFileItemHTML(file, uniqueID);
        fileListEl.insertAdjacentHTML("afterbegin", fileItemHTML);
        
        const currentFileItem= document.querySelector(`#file-item-${uniqueID}`)
        const cancelFileUploadButton= currentFileItem.querySelector(".cancel-button");
        const xhr = handlefileUploading(file, uniqueID);

        // HANDLING COMPLETION OF FILE UPLOAD
        xhr.addEventListener("readystatechange", ()=> {
            if(xhr.readyState=== XMLHttpRequest.DONE && xhr.status=== 200){
                completedFiles++;
                currentFileItem.querySelector(".file-status").textContent= "Completed"
                currentFileItem.querySelector(".file-status").style.color = "skyblue";
                cancelFileUploadButton.remove();
                dotEl.forEach(dot=> {
                    dot.classList.remove("active");
                    fileCompletedStatus.textContent= `${completedFiles} / ${totalFiles} files completed`;
                })
            }
        })
        // HANDLING CANCELLATION OF FILE UPLOAD
        cancelFileUploadButton.addEventListener("click", ()=> {
            xhr.abort();
             currentFileItem.querySelector(".file-status").textContent= "Cancelled"
              currentFileItem.querySelector(".file-status").style.color= "red";
              cancelFileUploadButton.remove();
        })
        xhr.addEventListener("error", ()=> {
            alert("An Error occured during the file upload!");
        })
    })
    fileCompletedStatus.textContent= `${completedFiles} / ${totalFiles} files completed`;
}

function handlefileUploading(file, uniqueID){
    const xhr= new XMLHttpRequest();
    const formData= new FormData();
    formData.append("file", file);

    // ADDING PROGRESS EVENTlISTENER TO THE AJAX REQUEST;
    xhr.upload.addEventListener("progress", e=> {
        dotEl.forEach(dot=> {
            dot.classList.add("active");
        })
        // UPDATING PROGRESS BAR AND FILE SIZE ELEMENT
        const fileProgress= document.querySelector(`#file-item-${uniqueID} .file-progress`);
        const fileSize= document.querySelector(`#file-item-${uniqueID} .file-size`);

        const progress= Math.round((e.loaded/ e.total)* 100);
        fileProgress.style.width= `${progress}%`;
        const loadedKb= (e.loaded/1024).toFixed(1);
        const totalKb= (e.total/1024).toFixed(1);

        fileSize.textContent= `${loadedKb} Kb/ ${totalKb} Kb`;
    })

    xhr.open("POST","20-api.php", true);
    xhr.send(formData);
    return xhr;
}

fileUploadBox.addEventListener("drop", (e)=>{
    e.preventDefault();
    handleSelectedFiles(e.dataTransfer.files);
    fileUploadBox.classList.add("active");
    dotEl.forEach(dot=> {
        dot.classList.add("active");
    })
    fileUploadBox.querySelector(".file-instruction").textContent= "Drag files here or"
})
fileUploadBox.addEventListener("dragover", (e)=>{
    e.preventDefault();
    fileUploadBox.classList.add("active");
    dotEl.forEach(dot=> {
        dot.classList.add("active");
    })
    fileUploadBox.querySelector(".file-instruction").textContent= "Release to upload or"
})
fileUploadBox.addEventListener("dragleave", (e)=>{
    e.preventDefault();
    fileUploadBox.classList.remove("active");
    dotEl.forEach(dot=> {
        dot.classList.remove("active");
    })
    fileUploadBox.querySelector(".file-instruction").textContent= "Drag File Here or"
})

fileBrowseInput.addEventListener("change", e=> handleSelectedFiles(e.target.files));
fileBrowseBtn.addEventListener("click", ()=> fileBrowseInput.click());


const openNewFile = document.querySelector('.openNewFile')  
dragOrDropContainer = document.querySelector('.dragOrDropContainer')  
dragBoxText = document.querySelector('.dragOrDropContainer .text')  
fileInput = document.querySelector('.header .options input[type=file]')  
sidebarToggleBtn = document.querySelector('.sidebarToggleBtn')  
sideBar = document.querySelector('.sideBar')  
outputDownloadBtn = document.querySelector('.outputDownloadBtn')  
optionBtnSqr = document.querySelectorAll('.optionBtnSqr')  
dragModeBtn = document.querySelectorAll('.dragModeBtn')  
let file  
openNewFile.addEventListener("click", () => {  
  fileInput.click()  
})  
fileInput.addEventListener('change', () => {  
  file = fileInput.files[0];  
  uploadFile()  
})  
const uploadFile = () => {  
  let fileType = file.type;  
  dragOrDropContainer.style.cursor = 'progress'  
  dragBoxText.innerText = 'Uploading file, Please Wait...'  
  let validExt = ["image/jpeg", "image/jpg", "image/png"];  
  if (validExt.includes(fileType)) {  
    let p = new Promise((resolve, reject) => {  
      let fileReader = new FileReader()  
      fileReader.onload = () => {  
        let fileURL = fileReader.result  
        let imageTag = `<img src="${fileURL}" id="imageWorkSpace" alt="image">`  
        dragOrDropContainer.innerHTML = imageTag  
        dragOrDropContainer.style.cursor = 'auto'  
        outputDownloadBtn.classList.remove('hide')  
        resolve(true)  
      }  
      fileReader.readAsDataURL(file)  
    }).then(() => {  
      let options = {  
        dargMode: "move",  
        preview: ".previewImage",  
        viewMode: 2,  
        modal: false,  
        background: false,  
        ready: () => {  
          // Zoom Image  
          document.querySelector('.zoomIn').onclick = () => cropper.zoom(0.1)  
          document.querySelector('.zoomOut').onclick = () => cropper.zoom(-0.1)  
          // Rotate Image  
          document.querySelector('.rotateLeft').onclick = () => cropper.rotate(90)  
          document.querySelector('.rotateRight').onclick = () => cropper.rotate(-90)  
          // Flip Image  
          let flipX = -1  
          flipY = -1  
          document.querySelector('.flipLeftRight').onclick = () => {  
            cropper.scale(flipX, 1)  
            flipX = -flipX  
          }  
          document.querySelector('.flipUpDown').onclick = () => {  
            cropper.scale(1, flipY)  
            flipY = -flipY  
          }  
          // set Aspect Ratio  
          optionBtnSqr[0].onclick = () => cropper.setAspectRatio(1.7777777777777777)  
          optionBtnSqr[1].onclick = () => cropper.setAspectRatio(1.4444444444444444)  
          optionBtnSqr[2].onclick = () => cropper.setAspectRatio(1)  
          optionBtnSqr[3].onclick = () => cropper.setAspectRatio(0.6666666666666666)  
          optionBtnSqr[4].onclick = () => cropper.setAspectRatio(0)  
          // Cropper Control  
          document.querySelector('.cropperClear').onclick = () => cropper.clear()  
          document.querySelector('.cropperCrop').onclick = () => cropper.crop()  
          // Drag Mode  
          dragModeBtn[0].onclick = () => {  
            dragModeBtn[0].classList.remove('selected')  
            dragModeBtn[0].classList.toggle('selected')  
            cropper.setDragMode("crop")  
          }  
          dragModeBtn[1].onclick = () => {  
            dragModeBtn[0].classList.remove('selected')  
            dragModeBtn[1].classList.toggle('selected')  
            cropper.setDragMode("move")  
          }  
          // download Image  
          outputDownloadBtn.onclick = () => {  
            outputDownloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'  
            setTimeout(() => {  
              cropper.getCroppedCanvas().toBlob((blob) => {  
                let downloadURL = window.URL.createObjectURL(blob)  
                let a = document.createElement('a')  
                a.href = downloadURL  
                a.download = `output-${Date.now()}.jpg`  
                a.click()  
                outputDownloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'   
              })  
            }, 2000)  
          }  
        }  
      }  
      let imageWorkSpace = document.querySelector('.dragOrDropContainer #imageWorkSpace')  
      let cropper = new Cropper(imageWorkSpace, options)  
    })  
  } else {  
    dragOrDropContainer.classList.remove("hide")  
    dragOrDropContainer.classList.remove("drag")  
    dragBoxText.innerText = "Drag & Drop to Upload File"  
    alert("This File is nat valid. Please choose another file and try again.")  
  }  
}  
sidebarToggleBtn.addEventListener("click", () => {  
  sideBar.classList.toggle('active')  
  if (sideBar.classList.contains('active')) {  
    sidebarToggleBtn.querySelector('i').classList.remove('fa-chevron-left')  
    sidebarToggleBtn.querySelector('i').classList.add('fa-chevron-right')  
  } else {  
    sidebarToggleBtn.querySelector('i').classList.remove('fa-chevron-right')  
    sidebarToggleBtn.querySelector('i').classList.add('fa-chevron-left')  
  }  
})  
dragOrDropContainer.addEventListener('dragover', (e) => {  
  e.preventDefault()  
  dragOrDropContainer.classList.add('drag')  
  dragBoxText.innerText = 'Release to Upload File'  
})  
dragOrDropContainer.addEventListener('dragleave', (e) => {  
  e.preventDefault()  
  dragOrDropContainer.classList.remove('drag')  
  dragBoxText.innerText = 'Drag & Drop to Upload File'  
})  
dragOrDropContainer.addEventListener('drop', (e) => {  
  e.preventDefault()  
  file = e.dataTransfer.files[0];  
  uploadFile()  
})  
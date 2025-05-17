const wrapper= document.querySelector(".wrapper"),
musicImg= wrapper.querySelector(".img-area img"),
musicName= wrapper.querySelector(".song-details .name"),
musicArtist= wrapper.querySelector(".song-details .artist"),
mainAudio= wrapper.querySelector("#main-audio"),
prevBtn= wrapper.querySelector("#prev"),
nextBtn= wrapper.querySelector("#next"),
playPauseBtn= wrapper.querySelector(".play-pause"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
repeatBtn= wrapper.querySelector("#repeat-plist"),
musicList= wrapper.querySelector(".music-list"),
songTitleEl= document.getElementById("songTitle");  

let bass= null;
let musicIndex= Math.floor((Math.random()* allMusic.length));

window.addEventListener("load", ()=> {
    loadMusic(musicIndex);
})

// function loadMusic(idxNumb){
//     musicName.textContent= allMusic[idxNumb- 1].name;
//     musicArtist.textContent= allMusic[idxNumb- 1].artist;
//     songTitleEl.textContent= `${allMusic[idxNumb- 1].name} - ${allMusic[idxNumb- 1].artist}`
//     musicImg.src= allMusic[idxNumb- 1].img;
//     mainAudio.src= allMusic[idxNumb- 1].src;
// }

function loadMusic(idxNumb){
    const { name, artist, img, src }= allMusic[idxNumb];
    musicName.textContent= name;
    musicArtist.textContent= artist;
    songTitleEl.textContent= `${name}- ${artist}`;
    musicImg.src= img;
    mainAudio.src= src;
}

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText= "pause";
    mainAudio.play();
    updateMusicList()
};

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText= "play_arrow";
    console.log("pausing music");
    mainAudio.pause();
    updateMusicList();
}

playPauseBtn.addEventListener("click", e=> {
    if(audioContext.state === 'suspended'){
        audioContext.resume();
    }
    const isMusicPaused= wrapper.classList.contains("paused");
    isMusicPaused? pauseMusic(): playMusic();
})

nextBtn.addEventListener("click", e=> {
    musicIndex++;
    musicIndex> allMusic.length? musicIndex= 1 : musicIndex= musicIndex;
    loadMusic(musicIndex);
    updateMusicList();
    playMusic();
})

prevBtn.addEventListener("click", e=>{
    musicIndex--;
    musicIndex< 1? musicIndex= allMusic.length : musicIndex= musicIndex;
    loadMusic(musicIndex);
    updateMusicList();
    playMusic();
})

mainAudio.addEventListener("timeupdate", e=> {
   const currentTime= e.target.currentTime;
   const duration= e.target.duration;
   let progressWidth= (currentTime/ duration)* 100;
   progressBar.style.width= `${progressWidth}%`;  
   
   let musicDuration= wrapper.querySelector(".duration"),
   musicCurrentTime= wrapper.querySelector(".current")
  
   mainAudio.addEventListener("loadeddata", ()=> {
        // DURATION
        let audioDuration= mainAudio.duration;
        let totalMin= Math.floor(audioDuration/ 60);
        let totalSec= Math.floor(audioDuration % 60);
        let secString= totalSec<10 ? "0" + totalSec: totalSec;
        musicDuration.textContent= `${totalMin}: ${secString}`;
    })
    let currentMin= Math.floor(currentTime / 60);
    let currentSec= Math.floor(currentTime % 60);
    let currentSecString= currentSec<10 ? "0" + currentSec: currentSec;
    musicCurrentTime.textContent= `${currentMin}: ${currentSecString}`;
});

progressArea.addEventListener("click", e=> {
    let progressWidthval= progressArea.clientWidth;
    let clickedOffSetX= e.offsetX;
    let songDuration= mainAudio.duration;

    mainAudio.currentTime= (clickedOffSetX/ progressWidthval)* songDuration; 
    playMusic();
})

repeatBtn.addEventListener("click", e=> {
    let getText= repeatBtn.textContent;
    switch(getText){
        case "repeat":
            repeatBtn.textContent= "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.textContent= "shuffle";
            repeatBtn.setAttribute("title", "PlayBack shuffle");
            break;    
        case "shuffle":
            repeatBtn.textContent= "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;    
    }
})

mainAudio.addEventListener("ended", e=> {
    let getText= repeatBtn.textContent;
    switch(getText){
        case "repeat":
        nextBtn.click() //next song
            break;
        case "repeat_one":
            mainAudio.currentTime= 0;
            loadMusic(musicIndex);
            playMusic();
            break;    
        case "shuffle":
            let randomIdx= Math.floor((Math.random()* allMusic.length)+ 1);
            do{
                randomIdx= Math.floor((Math.random()* allMusic.length)+ 1);
            }while (musicIndex === randomIdx);
            musicIndex= randomIdx;
            loadMusic(musicIndex);
            playMusic();
            break;    
    }
})

wrapper.addEventListener("click", e=> {
    if(e.target.id=== "more-music"){
        musicList.classList.toggle("show", true);
    }else if(e.target.id=== "close"){
        musicList.classList.remove("show", false);
    }
    
    let liE= e.target.closest("li");
    if(liE){
        let getLiIndex= liE.getAttribute("li-index");
        musicIndex= getLiIndex;
        loadMusic(musicIndex);
        playMusic();
        document.querySelectorAll(".music-list li").forEach(li => {
            let durationEl= li.querySelector(".audio-duration");
            li.classList.remove("playing");
            if(durationEl) durationEl.textContent= durationEl.dataset.duration;
        })
        liE.classList.add("playing");
        let audioTag = liE.querySelector(".audio-duration");
        if(audioTag){
            audioTag.textContent= "Playing";
        }
    }
});

allMusic.forEach((el, idx)=> {
    let ulTag= wrapper.querySelector("ul"),
    mainAudio= new Audio(el.src);
    mainAudio.addEventListener("loadedmetadata", ()=> {
        // DURATION
        let audioDuration= mainAudio.duration,
                 totalMin= Math.floor(audioDuration/ 60);
                 totalSec= Math.floor(audioDuration % 60);
                secString= totalSec<10 ? "0" + totalSec: totalSec;
        formattedDuration= `${totalMin}:${secString}`
        allMusic[idx].duration= formattedDuration;
        
        let liTag= `<li li-index= "${idx+ 1}">
                    <div class="row">
                        <span class="song-name">${el.name}</span>
                        <p class="song-artist">${el.artist}</p>
                    </div>
                        <span class="audio-duration" 
                        data-duration= ${formattedDuration}
                        >${formattedDuration}</span>
                </li>`;
        ulTag.insertAdjacentHTML("beforeend", liTag);  
    })
});

function updateMusicList() {
    document.querySelectorAll(".music-list li").forEach(li => {
        let durationEl = li.querySelector(".audio-duration");
        let getLiIndex= li.getAttribute("li-index");
        if (getLiIndex == musicIndex) {
            li.classList.add("playing");
            if (durationEl) durationEl.textContent = "Playing";
        } else if(li.classList.contains("playing")){
            li.classList.remove("playing");
            if (durationEl) durationEl.textContent = durationEl.dataset.duration;
        }
    });
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(mainAudio);
source.connect(analyser);
analyser.connect(audioContext.destination);
const frequencyData = new Uint8Array(analyser.frequencyBinCount);

function updateVisualization() {
    analyser.getByteFrequencyData(frequencyData);
    // Mendapatkan frekuensi rendah, seperti bas
    bass = frequencyData.slice(0, 10).reduce((a, b) => a + b) / 10;
    
    // Mengubah ukuran dan warna lingkaran berdasarkan frekuensi
    updateCircle(bass);
    
    requestAnimationFrame(updateVisualization);
}
updateVisualization();

function updateCircle(bass) {
    const circles = document.querySelectorAll(".circle");
    const maxBass = 255; // Asumsi maksimum nilai frekuensi
    
    // Skala ukuran dan warna berdasarkan bass
    const scale = Math.min(bass / maxBass, 1); // Skala antara 0 dan 1
    const newSize = 125 * (1 + scale * 0.5); // Contoh perubahan ukuran
    const newColor = `cornflowerblue, ${scale})`; // Contoh perubahan warna
    const opacity= Math.min(scale * 0.6, 0.6)
    
    circles.forEach(el => {
        el.style.width = `${newSize}px`;
        el.style.height = `${newSize}px`;
        el.style.background = `linear-gradient(deg, transparent, ${newColor})`;
        el.style.opacity= opacity;
    })
}

// function updateCircle(bass) { 
//     const circles = document.querySelectorAll(".circle");
//     const maxBass = 255; // Asumsi maksimum nilai frekuensi
    
//     // Skala ukuran dan warna berdasarkan bass
//     const scale = Math.min(bass / maxBass, 1); // Skala antara 0 dan 1
//     const newSize = 125 * (1 + scale * 0.5); // Contoh perubahan ukuran
    
//     // Pilih warna berdasarkan skala
//     const r = Math.floor(155 * (scale+ 1)); // Warna merah berdasarkan skala
//     const g = Math.floor(255 * (1 - scale)); // Warna hijau berlawanan dengan skala
//     const b = Math.floor(255 * scale); 
    
//    circles.forEach(el => {
//         el.style.width = `${newSize}px`;
//         el.style.height = `${newSize}px`;
//         el.style.background = `rgba(${r}, ${150}, ${b}, ${b})`;
//     });
// }







    const url= "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = "d0f77b2063c7222a29bb9cdaf5940117";
    const locationInput= document.getElementById("locationInput");
    const searchBtn= document.getElementById("searchBtn");
    const locationEl= document.getElementById("location");
    const suhuEl= document.getElementById("suhu");
    const descriptionEl= document.getElementById("deskripsi");
    const humidityEl= document.getElementById("kelembapan");
    const alertEl= document.getElementById("alert");
    const dateTimeEl= document.getElementById("dateTime");
    const weatherIcon= document.getElementById("icon");
    const weatherInfo= document.getElementById("weatherInfo");

    locationInput.addEventListener("focus", (e)=>{
        locationEl.textContent = "";
        suhuEl.textContent = "";
        descriptionEl.textContent = "";
        humidityEl.textContent = "";
        alertEl.textContent = "";
        weatherIcon.style.display= "none";
        weatherInfo.style.display= "none";
        // dateTimeEl.textContent= "";
        })
    
    locationInput.addEventListener("keydown", (e)=> {
        if(e.key === "Enter") searchBtn.click()
    })    
        
    searchBtn.addEventListener("click", (e)=> {
        const cityName= locationInput.value;
        console.log("01.", cityName)
        if(cityName){
            fetchWeather(cityName)
        } else {
            alert(" Lokasi Kota tidak boleh kosong..!")
        }
        locationInput.value="";
    })

    function convertDT(timestamp){
        const date= new Date(timestamp* 1000)
        const options= {
        weekday: "long",
        month: "long",
        year: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
        }
        // const result= Intl.DateTimeFormat("id-ID", options).format(date);
        
        // cara kedua :
        const result= date.toLocaleString("id-ID", options);
        dateTimeEl.textContent= result;
    }    
    
    const weatherMap= {
        Clear: { text: "Cerah", icon: "img/clear.png"},
        Clouds: { text: "Berawan", icon: "img/clouds.png"},
        Rain: { text: "Hujan", icon: "img/rain.png"},
        Drizzle: { text: "Hujan Gerimis", icon: "img/drizzle.png"},
        Thunderstorm: { text: "Badai Petir", icon: "img/thunder.png"},
        Mist: {text: "Berkabut", icon: "img/mist.png"},
        Haze: {text: "Berkabut", icon: "img/mist.png"},
        Default: { text: "Unknown", icon: "img/unknown.png"}
    }


    function fetchWeather(cityName){
        fetch(`${url}?q=${cityName}&appid=${apiKey}&units=metric`)
            .then(response => {
                if(!response.ok){
                    throw new Error("Error Fetching"+ response.statusText)
                }
                return response.json();
            })
            .then(data => {
                console.log("02.", data)
                locationEl.textContent= data.name;  
                suhuEl.textContent= `${Math.round(data.main.temp)}°C`
                
                console.log(data.weather[0].main)
                const weatherDescription= data.weather[0].main;
                const weatherInformation= weatherMap[weatherDescription] || weatherMap.default;
                
                descriptionEl.textContent= weatherInformation.text;
                weatherIcon.src= weatherInformation.icon;
                weatherIcon.style.display= "block";
                humidityEl.textContent= `Kelambaban: ${data.main.humidity}%`;
                weatherInfo.style.display= "block";
                alertEl.textContent= "";
                // convertDT(data.dt);
                })    
                .catch(error=> {
                    console.log("Error fetching data:", error);
                    alert("Lokasi Kota tidak ditemukan..!");
                })
    }
  
   
const url= "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "d0f77b2063c7222a29bb9cdaf5940117";
const cityName= "Surabaya";

fetch(`${url}?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => {
        if(!response.ok){
            throw new Error("Error Fetching"+ response.statusText)
        }
        return response.json();
    })
    .then(data => {
        console.log("01.", data)
        console.log(`Temperature di ${cityName}: ${data.main.temp}°C`);
        console.log(`Coordinate: Latitude ${data.coord.lat}, longitude ${data.coord.lon}`)
    })    
    .catch(error=> console.log("Error:", error));

  
   
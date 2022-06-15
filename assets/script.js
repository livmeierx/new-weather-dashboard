// assign a unique API to variable and set other variable
var APIKey = "bf35e76068825d20a4cff09151512725";
var currentCity = "";
var searchCity = "";

var noErrors = (response) => {
    if (response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

//function to retrieve and display current conditions 
var currentWeather = (event) => {
    let city = $("#city-search").val();
    currentCity = $("#search-city").val();

    //fetch from API
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
    fetch(queryURL)
    .then(noErrors)
    .then((response) => {
        return response.json();
    })
    //save to storage 
    .then((response) => {
        saveCity(city);
        $("#search-error").text("");
        //create icon using api
        let currentWeatherData="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        //use moment.js
        let timeUTC = response.dt;
        let timeZoneUpdate = response.timezone;
        let timeZoneHours = timeZoneUpdate / 60 / 60;
        
    })
}

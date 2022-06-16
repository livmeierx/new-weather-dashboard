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
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;
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
        let currentWeatherData = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        //use moment.js
        let timeUTC = response.dt;
        let timeZoneUpdate = response.timezone;
        let timeZoneHours = timeZoneUpdate / 60 / 60;
        let currentTime = moment.unix(timeUTC).utc().utcOffset(timeZoneHours);

        getCities();

        getForecast();
        $("#header-text").text(response.name);

        //get results with HTML
        let currentWeatherHTML = '
            <h2>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"></img></h2>
            <ul>
                <li>Temperature: ${response.main.temp} &8457;</li>
                <li>Humidty: ${response.main.humdity} %</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>';
        //append results
        $("#current-weather").html(currentWeatherHTML);

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvQuery = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;

        fetch(uvQuery)
        .then(noErrors)
        .then ((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $("#uvIndex").html('UV Index: <span id="uvVal"> ${uvIndex}</span>');
            if (uvIndex>=0 && uvIndex<3){
                $("#uvVal").attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $("#uvVal").attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $("#uvVal").attr("class", "uv-severe");
            }
        });
    })
}

var getForecast = (event) => {

}

var getCities = () => {

}

var saveCity = (newCity) => {

}

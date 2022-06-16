// assign a unique API to variable and set other variable
var APIKey = "bf35e76068825d20a4cff09151512725";
var currentCity = "";
var searchCity = "";

//function to retrieve and display current conditions 
var currentWeather = (event) => {
    let city = $('#city-search').val();
    currentCity = $('#search-city').val();

    //fetch from API
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey;
    fetch(queryURL)
    .then(checkErrors)
    .then((response) => {
        return response.json();
    })
    //save to storage 
    .then((response) => {
        saveCity(city);
        $('#search-error').text("");
        //create icon using api
        let currentWeatherData = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        //use moment.js
        let timeUTC = response.dt;
        let currentTimeZoneUpdate = response.timezone;
        let currentTimeZoneHours = currentTimeZoneUpdate / 60 / 60;
        let currentTime = moment.unix(timeUTC).utc().utcOffset(currentTimeZoneHours);

        getCities();

        getFiveDay();

        // $('#header-text').text(response.name);

        //get results with HTML
        let currentWeatherHTML = `
            <h3>${response.name} ${currentTime.format("(MM/DD/YY)")}<img src="${currentWeatherData}"></h3>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp}&#8457;</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>`;
        //append results
        $('#current-weather').html(currentWeatherHTML);

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvQueryLink = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;

        fetch(uvQueryLink)
        .then(noErrors)
        .then ((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $('#uvIndex').html('UV Index: <span id="uvVal"> ${uvIndex}</span>');
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
        });
    })
};


//function to retrieve and display five day forcast
var getFiveDay = (event) => {
    let city = $('#city-search').val();
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + APIKey;

    fetch(queryURL)
    .then(checkErrors)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        let fiveDayHMTL = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;

        for (let i = 0; i < response.list.length; i++) {
            let dayInfo = response.list[i];
            let dayUTC = dayInfo.dt;
            let dayTimeZone = response.city.timezone;
            let dayZoneHours = dayTimeZone / 60 / 60;
            let thisMoment = moment.unix(dayUTC).utc().utcOffset(dayZoneHours);
            let iconURL = "https://openweathermap.org/img/w/" + dayInfo.weather[0].icon + ".png";

            if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                getFiveDay += `
                <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayInfo.main.temp}&#8457;</li>
                        <br>
                        <li>Humidity: ${dayInfo.main.humidity}%</li>
                    </ul>
                </div>`;
            }  
        }
        fiveDayHMTL += '</div>';
        $('#five-day').html(fiveDayHMTL)
    });
}

//function to get list of cities
var getCities = () => {
    $('#city-results').empty();
    if (localStorage.length === 0) {
        if (searchCity) {
            $('#city-search').attr("value", searchCity);
        } else {
            $('#city-search').attr("value", "Trenton");
        }
    } else {
        let lastCitySelected="cities"+(localStorage.length-1);
        searchCity=localStorage.getItem(lastCitySelected);
        $('#city-search').attr("value", searchCity);

        for (let i = 0; i < localStorage.length; i++);
            let city = localStorage.getItem("cities" + i);
            let cityEl;

            if (currentCity==="") {
                currentCity=searchCity;
            }
            if (city == currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            } 
            $('#city-results').prepend(cityEl);
    }
    if (localStorage.length>0) {
        $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
    } else {
        $('#clear-storage').html('');
    }
};

//function to save info to localStorage
var saveCity = (newCity) => {
    let cityExists = false;
    
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] == newCity) {
            cityExists = true;
            break;
        }
    }
    if (cityExists == false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}

//function for errors
var checkErrors = (response) => {
    if (response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

//new city event listener
$('#search-button').on("click", (event) => {
    event.preventDefault();
    currentCity = $('#city-search').val();
    currentWeather(event);
});

//prior search event listener
$('#city-results').on("click", (event) => {
    event.preventDefault();
    $('#city-search').val(event.target.textContent);
    currentCity=$('#city-search').val();
    currentWeather(event);
});

//clear button event listener
$('#clear-storage').on("click", (event) => {
    localStorage.clear();
    getCities();
});

getCities();
currentWeather();

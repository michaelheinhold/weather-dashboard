var apiKey = '5d237a397a92866c7385ac9fe8965ec9';
var currentEl = document.querySelector('.current-info');
var weatherInfo = document.querySelector('.weather-info');
var userSearch = document.querySelector('.search');
let searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var historyListEl = document.querySelector('#history');

$('#searchBtn').on('click', function(event) {
    event.preventDefault();
    if(!userSearch.value){
        alert('Please enter a valid city');
        return;
    }

    //store search to history
    var userSearchValue = userSearch.value
    searchHistory.push(userSearchValue);
    localStorage.setItem('search', JSON.stringify(searchHistory));
    
    

    //get user input and search the city
    var searchedCity = userSearch.value.trim();
    userSearch.value = ''
    getCityWeather(searchedCity);
    setLocalStorage();
    //get city coords
});

var getCityWeather = function(searchedCity) { fetch (
        'https://api.openweathermap.org/data/2.5/weather?q='+searchedCity+'&appid='+apiKey
    )
    .then(function(response){
        if(response.ok){
        }
        response.json()
        .then(function(data){
            var lat = data.coord.lat
            var lon = data.coord.lon
            var name = data.name
            var currentDate = moment().format('MM/DD/YYYY')
            var cityName = document.querySelector('.city-name');
            cityName.textContent= name + " (" +currentDate+')';

            //using coords get weather info
            fetch (
                'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid='+apiKey
            )
            .then(function(response){
                response.json()
                .then(function(data){
                    currentEl.innerHTML='';

                    //get current data
                    var current = data.current;

                    //weather conditions
                    var currentConditions = current.weather[0].icon;
                    var currentIcon = document.querySelector('#weather-icon');
                    currentIcon.removeAttribute('src');
                    currentIcon.setAttribute('src', 'http://openweathermap.org/img/wn/'+currentConditions+'@2x.png');
                    
                    //temp
                    var tempEl = document.createElement('p')
                    tempEl.textContent = 'Temp: '+current.temp+'°F';
                    currentEl.appendChild(tempEl);
                    
                    //humidity
                    var humidityEl = document.createElement('p')
                    humidityEl.textContent='Humidity: '+current.humidity+'%';
                    currentEl.appendChild(humidityEl);
                    
                    //wind speed
                    var windEl = document.createElement('p')
                    windEl.textContent = 'Wind Speed: '+current.wind_speed+'mph';
                    currentEl.appendChild(windEl);
                    
                    //uv index
                    var uvEl = document.createElement('p')
                    //check to see what category (for the color)
                    if(current.uvi >= 6){
                        uvEl.innerHTML="UV Index: <span class='badge bg-danger'>"+current.uvi+"</span>";
                    }else if (current.uvi >=3 &&current.uvi < 6){
                        uvEl.innerHTML="UV Index: <span class='badge bg-warning'>"+current.uvi+"</span>";
                    } else if(current.uvi<3){
                        uvEl.innerHTML="UV Index: <span class='badge bg-success'>"+current.uvi+"</span>";
                    }
                    currentEl.appendChild(uvEl);

                    //data for the 5 day forecast
                    var dailyForecast = data.daily
                    var forecastEl = document.querySelector('#forecast');
                    //clears old cards
                    forecastEl.innerHTML='';
                    //sets date to +1
                    var dateCounter = 1;
                    //for loop for 5 day forcast
                    for(var i =0; i< dailyForecast.length-3;i++){
                        //create each day
                        var dailyCard = document.createElement('div');
                        $(dailyCard).addClass('col bg-primary text-white ml-3 mb-3 rounded');
                        //add each day
                        var date = moment().add(dateCounter, 'days').format('MM/DD/YYYY');
                        var dateEl = document.createElement('h4');
                        dateEl.textContent=date;
                        //increases counter by 1
                        dateCounter++;
                        dailyCard.appendChild(dateEl);

                        //add weather icon
                        var iconEl = document.createElement('img');
                        var iconCode = dailyForecast[i].weather[0].icon
                        iconEl.setAttribute('src', 'http://openweathermap.org/img/wn/'+iconCode+'@2x.png');
                        dailyCard.appendChild(iconEl);

                        //add temp
                        var dailyTempEl = document.createElement('p');
                        dailyTempEl.innerText='Temp: '+dailyForecast[i].temp.max+'°F';
                        dailyCard.appendChild(dailyTempEl);

                        //add wind
                        var dailyWindEl = document.createElement('p');
                        dailyWindEl.innerText = 'Wind: '+dailyForecast[i].wind_speed+'mph';
                        dailyCard.appendChild(dailyWindEl);

                        //add humidity
                        var dailyHumidityEl = document.createElement('p');
                        dailyHumidityEl.innerText = 'Humidity: '+dailyForecast[i].humidity+'%';
                        dailyCard.appendChild(dailyHumidityEl);
                        
                        //add the whole card
                        forecastEl.appendChild(dailyCard);
                    }

                })
            })
        })
    })};



var setLocalStorage = function() {
    historyListEl.innerHTML=''
    for (var i=0; i<searchHistory.length; i++) {
        var historyItem = document.createElement("input");
        // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control history-item d-block bg-white mb-2");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function(event) {
            getCityWeather(event.target.value);
            })
        historyListEl.append(historyItem);
    }
};


setLocalStorage();

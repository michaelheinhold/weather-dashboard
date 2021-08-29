var apiKey = '5d237a397a92866c7385ac9fe8965ec9';
var currentEl = document.querySelector('.current-info');
var weatherInfo = document.querySelector('.weather-info');
var userSearch = document.querySelector('.search');


$('#searchBtn').on('click', function(event) {
    event.preventDefault();
    //get user input and search the city
    var searchedCity = userSearch.value.trim();
    console.log(searchedCity)

    //get city coords
    fetch (
        'https://api.openweathermap.org/data/2.5/weather?q='+searchedCity+'&appid='+apiKey
    )
    .then(function(response){
        response.json()
        .then(function(data){
            var lat = data.coord.lat
            var lon = data.coord.lon
            var name = data.name
            var currentDate = moment().format('MM/DD/YYYY')
            console.log(name)
            var cityName = document.querySelector('.city-name');
            cityName.textContent= name + " (" +currentDate+')';

            //using coords get weather info
            fetch (
                'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&appid='+apiKey
            )
            .then(function(response){
                response.json()
                .then(function(data){
                    console.log(data);
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

                    //for loop for 5 day forcast
                    for(var i =0; i< dailyForecast.length-3;i++){
                        var forecastEl = document.querySelector('#forecast')
                        var dailyCard = document.createElement('div');
                        $(dailyCard).addClass('col bg-primary text-white ml-3 mb-3 rounded');
                        dailyCard.textContent='hi bois';
                        forecastEl.appendChild(dailyCard)
                    }

                })
            })
        })
    })
})


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
            cityName.textContent= name + " " +currentDate;

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
                    currentIcon.setAttribute('src', 'http://openweathermap.org/img/wn/'+currentConditions+'.png');
                    
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
                    uvEl.textContent='UV Index: '+current.uvi;
                    //check to see what category (for the color)
                    if(uvEl >= 6){
                        uvEl.setAttribute('class', 'high');
                    }else if (uvEl < 6){
                        uvEl.setAttribute('class', 'med');
                    } else if(uvEl<3){
                        uvEl.setAttribute('class', 'low');
                    }
                    currentEl.appendChild(uvEl);

                    //data for the 5 day forecast

                })
            })
        })
    })
})


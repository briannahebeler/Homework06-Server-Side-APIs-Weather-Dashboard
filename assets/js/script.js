$(document).ready(function () {

    $("#search-button").on("click", function () {
        var searchValue = $("#search-value").val();
        $("search-value").val("");
        searchWeather(searchValue);
        // $("#search-value").reset;
    })

    var searchHistory = [];

    function saveSearch(searchedCity) {
        localStorage.setItem("savedSearch", searchedCity);
        // localStorage.setItem("sessionSearchHistory", searchHistory);

        if(!searchHistory.includes(searchedCity)){
            searchHistory.push(searchedCity);
            var cityName = $("<h6>").addClass("card-body").text(searchedCity);
            var card = $("<div>").addClass("card");
            card.append(cityName);

            $("#searchHistory").append(card);

            cityName.on("click", function() {
                searchWeather(this.innerHTML);
            })
        }
    }

    function searchWeather(searchValue) {
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=c691cfbf611a02788a2576d8d581c1c7&units=imperial`,
            dataType: "json",
        }).then(function(data) {

            saveSearch(searchValue);

            $("#today").empty();

            //creating a card for appending weather data
            var title = $("<h2>").addClass("card-title").text(data.name)
            var currentDate = $("<h5>").addClass("card-subtitle mb-2 text-muted").text(moment().format('L'));
            var iconURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            var icon = $("<img>").attr("src", iconURL);
            var card = $("<div>").addClass("card");
            var temp = $("<p>").addClass("card-text").text("Temp: " + data.main.temp + " °F");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");
            var humid = $("<p>").addClass("card-text").text(`Humidity: ${data.main.humidity}%`);
            var cardBody = $("<div>").addClass("card-body").attr("id", "searchWeather");

            cardBody.append(title, currentDate, temp, humid, wind);
            card.append(cardBody);
            title.append(icon);
            $("#today").append(card);

            searchUV(data.coord.lat, data.coord.lon);
            search5Day(searchValue);
        });
    }

    function searchUV(lat, lon) {
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=436b282f4e8096812742aad81f633d29`,
            dataType: "json",
        }).then(function(data) {
            var uv = $("<p>").addClass("card-text").text(`UV Index: `);
            var uvIndex = $("<span>").text(`${data.value}`);
            
            if (data.value < 3) {
                uvIndex.addClass("uvFavorable");
            }
            else if (data.value <= 5) {
                uvIndex.addClass("uvModerate");
            }
            else {
                uvIndex.addClass("uvSevere");
            }

            uv.append(uvIndex);
            $("#searchWeather").append(uv);

        });
    }

    function search5Day(searchValue) {
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=613b70a86934e746511d06fb5fb23217&units=imperial`,
            dataType: "json",
        }).then(function(data) {
            $("#5DayTitle").empty();
            $("#5day").empty();
            
            var fiveDay = `<h3 style="text-align: center; margin-top: 10px;">5 Day Forecast</h3>`
            $("#5DayTitle").append(fiveDay);

            for (var i = 7; i < data.list.length; i=i+8) {
                var iconURL = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
                var icon = $("<img>").attr("src", iconURL);
                var card = $("<div>").addClass("card bg-primary");
                var col = $("<div>").addClass("col");
                var temp = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");
                var humid = $("<p>").addClass("card-text").text(`Humidity: ${data.list[i].main.humidity}%`);
                var cardBody = $("<div>").addClass("card-body");

                if (i === 7) {
                    var title = $("<h6>").addClass("card-title").text(moment().add(1, 'days').format('L'));
                }
                else if (i === 15) {
                    var title = $("<h6>").addClass("card-title").text(moment().add(2, 'days').format('L'));
                }
                else if (i === 23) {
                    var title = $("<h6>").addClass("card-title").text(moment().add(3, 'days').format('L'));
                }
                else if (i === 31) {
                    var title = $("<h6>").addClass("card-title").text(moment().add(4, 'days').format('L'));
                }
                else if (i === 39) {
                    var title = $("<h6>").addClass("card-title").text(moment().add(5, 'days').format('L'));
                }

                title.append(icon);
                cardBody.append(title, temp, humid);
                card.append(cardBody);
                col.append(card);
                $("#5day").append(col);
            }
        });

    }

    function displaySearchHistory() {
        var history = localStorage.getItem("savedSearch");
        searchWeather(history);
    }

    displaySearchHistory();

})
$(document).ready(function () {

    $("#search-button").on("click", function () {
        var searchValue = $("#search-value").val();

        $("search-value").val("");

        searchWeather(searchValue);
    })



    function searchWeather(searchValue) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=c691cfbf611a02788a2576d8d581c1c7&units=imperial`,
            dataType: "json",
        }).then(function(data) {
            //create history link for the search (Look up .push())
            //this is used to set items to local storage- is done in function of first call

            $("#today").empty();

            //creating a card for appending weather data
            var title = $("<h3>").addClass("card-title").text(data.name + " (" + moment().format('L') + ")" + " ");
            var iconURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            var icon = $("<img>").attr("src", iconURL);
            var card = $("<div>").addClass("card");
            var temp = $("<p>").addClass("card-text").text("Temp: " + data.main.temp);
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed);
            var humid = $("<p>").addClass("card-text").text(`Humidity: ${data.main.humidity}`);
            var cardBody = $("<div>").addClass("card-body").attr("id", "searchWeather");

            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            title.append(icon);
            $("#today").append(card);

            searchUV(data.coord.lat, data.coord.lon);
            // console.log(data.coord.lat + " " + data.coord.lon);

            search5Day(searchValue);



        });
    }

    function searchUV(lat, lon) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=436b282f4e8096812742aad81f633d29`,
            dataType: "json",
        }).then(function(data) {
            var uv = $("<p>").addClass("card-text").text(`UV Index: ${data.value}`);
            
            if (data.value < 3) {
                uv.addClass("uvFavorable");
            }
            else if (data.value <= 5) {
                uv.addClass("uvModerate");
            }
            else {
                uv.addClass("uvSevere");
            }

            $("#searchWeather").append(uv);

        });
    }

    function search5Day(searchValue) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=613b70a86934e746511d06fb5fb23217&units=imperial`,
            dataType: "json",
        }).then(function(data) {

            $("#5day").empty();
            var fiveDay = `<h3>5 Day Forecast</h3>`
            $("#5day").append(fiveDay);

            for (var i = 3; i < data.list.length; i=i+8) {
                var forecastDate = data.list[i].dt_txt;
                var title = $("<h3>").addClass("card-title").text(forecastDate.split(" ")[0]);
                var iconURL = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
                var icon = $("<img>").attr("src", iconURL);
                // var card = $("<div>").addClass("col-sm-2 card").attr("id", "day1");
                var card = $("<div>").addClass("card");
                var temp = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");
                var humid = $("<p>").addClass("card-text").text(`Humidity: ${data.list[i].main.humidity} %`);
                var cardBody = $("<div>").addClass("card-body");

                cardBody.append(title, temp, humid);
                card.append(cardBody);
                title.append(icon);
                $("#5day").append(card);
            }
        });

    }

    //use a for loop to loop over all forcasts (by specs)


    //get current search history, if there is any 

    //print out search history 
    //hind- needs to clickable bc you are going to pass search value into it


})
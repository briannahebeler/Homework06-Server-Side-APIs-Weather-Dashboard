$(document).ready(function () {

    $("#search-button").on("click", function () {
        var searchValue = $("#search-value").val();

        $("search-value").val("");

        searchWeather(searchValue);
        searchUV(searchValue);
        // search5Day(searchValue);
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

            // search5Day(searchValue);



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
                // console.log(uv);
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

    // function search5Day() {
    //     $.ajax({
    //         type: "GET",
    //         url: `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=c691cfbf611a02788a2576d8d581c1c7&units=imperial`,
    //         dataType: "json",
    //     }).then(function(data) {
    //         console.log(data);
    //         $("#5day").empty();
    //         var uv = $("<p>").addClass("card-text").text(`UV Index: + ${data.value}`);

    //         $("#5day").append("");

    //     });

    // }

    //function to get forecast- diff url

    //use a for loop to loop over all forcasts (by specs)

    // function to get uv index (this is another dif url call)
    //this uv index even though diff call. append to same sepcs from search body card


    //get current search history, if there is any 

    //print out search history 
    //hind- needs to clickable bc you are going to pass search value into it


})
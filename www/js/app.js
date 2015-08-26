$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
});


//check device is ready
function onDeviceReady() {
    console.log('Device Ready..');

    $('#show_more_location').click(function (e) {
        e.preventDefault();
        getMoreLocation();
    });

    $('#clear_info').click(function (e) {
        e.preventDefault();
        clearInfo();
    });


    getDate();
    getLocation();

}

function getDate() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    $('#datetime_display').html(datetime);
}

//Get current user location
function getLocation() {
    console.log('Getting users Location...');

    navigator.geolocation.getCurrentPosition(function (poistion) {
        var lat = poistion.coords.latitude;
        var lon = poistion.coords.longitude;
        var city = '';
        var state = '';
        var html = '';
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon,
            datatype: 'jsonp',
            success: function (response) {
                city = response.results[0].address_components[3].long_name;
                state = response.results[0].address_components[5].short_name;
                html = '<h1>' + city + ',' + state + '</h1>';
                $('#myLocation').html(html);

                //Get Weather Info
                getWeather(city, state);
                $('#show_more_weather').click(function (e) {
                    e.preventDefault();
                    getMoreWeather(city, state);
                    $('.navbar-toggle').click();
                });
            }
        });
    });
}

function getMoreLocation() {
    console.log('Getting More Location Info');
    //close dropdown menu
    $('.navbar-toggle').click();
    var html = '';
    navigator.geolocation.getCurrentPosition(function (position) {
        html = '<ul id="more_location_list" class="list-group">' +
            '<li class="list-group-item"><strong>Latitude: </strong>' + position.coords.latitude + '</li>' +
            '<li class="list-group-item"><strong>Longitude: </strong>' + position.coords.longitude + '</li>' +
            '<li class="list-group-item"><strong>Altitude: </strong>' + position.coords.altitude + '</li>' +
            '<li class="list-group-item"><strong>Accuracy: </strong>' + position.coords.accuracy + '</li>' +
            '</ul>';

        $('#more_location_display').html(html);
    });
}

function getWeather(city, state) {
    var html = '';
    $.ajax({

        url: 'http://api.wunderground.com/api/8afcb17daca684bb/conditions/q/' + state + '/' + city + '.json',
        datatype: 'jsonp',
        success: function (parse_response) {
            console.log(parse_response);
            weather = parse_response['current_observation']['weather'];
            temp_string = parse_response['current_observation']['temperature_string'];
            icon_url = parse_response['current_observation']['icon_url'];
            html = '<h1 class="text-center"><img src="' + icon_url + '">' + weather + '</h1><h2 class = "text-center" > ' + temp_string + ' </h2>';
            $('#weather').html(html)
        }
    });
}

//display more weather info
function getMoreWeather(city, state) {
    var html = '';
    $.ajax({
        url: 'http://api.wunderground.com/api/62d0e72f66a7de1a/conditions/q/' + state + '/' + city + '.json',
        datatype: 'jsonp',
        success: function (parsed_json) {
            console.log(parsed_json);
            temp_f = parsed_json['current_observation']['temp_f'];
            temp_c = parsed_json['current_observation']['temp_c'];
            dewpoint_string = parsed_json['current_observation']['dewpoint_string'];
            dewpoint_f = parsed_json['current_observation']['dewpoint_f'];
            dewpoint_c = parsed_json['current_observation']['dewpoint_c'];
            wind_string = parsed_json['current_observation']['wind_string'];
            wind_dir = parsed_json['current_observation']['wind_dir'];
            wind_mph = parsed_json['current_observation']['wind_mph'];
            visibility = parsed_json['current_observation']['visibility'];
            solarradiation = parsed_json['current_observation']['solarradiation'];
            relative_humidity = parsed_json['current_observation']['relative_humidity'];
            local_time = parsed_json['current_observation']['local_time_rfc822'];
            precip_today_in = parsed_json['current_observation']['precip_today_in'];
            feelslike_string = parsed_json['current_observation']['feelslike_string'];
            feelslike_f = parsed_json['current_observation']['feelslike_f'];
            feelslike_c = parsed_json['current_observation']['feelslike_c'];

            html = '<ul id="more_weather_list" class="list-group">' +
                '<li class="list-group-item"><strong>Feels Like: </strong>' + feelslike_string + '</li>' +
                '<li class="list-group-item"><strong>Dewpoint: </strong>' + dewpoint_string + '</li>' +
                '<li class="list-group-item"><strong>Wind: </strong>' + wind_string + '</li>' +
                '<li class="list-group-item"><strong>Wind Speed: </strong>' + wind_mph + '</li>' +
                '<li class="list-group-item"><strong>Humidity: </strong>' + relative_humidity + '</li>' +
                '<li class="list-group-item"><strong>Solar Radiation: </strong>' + solarradiation + '</li>' +
                '<li class="list-group-item"><strong>Precipitation: </strong>' + precip_today_in + '</li>' +
                '</ul>';

            $('#more_weather_display').html(html);
        }
    });

}

function clearInfo() {
    getLocation();
    $('.navbar-toggle').click();
    $('#more_weather_display').html('');
    $('#more_location_display').html('');

}
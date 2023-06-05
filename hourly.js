let searchBoxValue
const getLocation = document.getElementById("get-location");

document.getElementById('searchbox2').addEventListener("keypress", (event) => {
    if (event.code === 'Enter') {
        event.preventDefault();
        searchBoxValue = document.getElementById("searchbox2").value

        getWeatherDetails()
    }
});

function getWeatherDetails() {
    fetch(`https://us1.locationiq.com/v1/search.php?key=pk.06932791bf8691ae00981592197e62fb&q=${searchBoxValue}&format=json`)
        .then(response => response.json())
        .then(data => {

            let lat = data[0]['lat']
            let long = data[0]['lon']

            document.getElementById('location').innerHTML = data[0]['display_name'].split(',')[0]

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=metric&appid=9cd32b780681ffb235e82a9cd51e7b27`)
                .then(response => response.json())
                .then(data => {

                    for (let i = 0; i < 24; i++) {
                        let tempid = `htemp${i + 1}`
                        let dateid = `htime${i + 1}`
                        let iconid = data['hourly'][i]['weather'][0]['icon']

                        var img = document.createElement('img')
                        img.src = `http://openweathermap.org/img/wn/${iconid}@2x.png`
                        var div = document.getElementById(`himg${i + 1}`)
                        div.appendChild(img)

                        document.getElementById(tempid).innerHTML = data['hourly'][i]['temp']

                        document.getElementById(dateid).innerHTML = formatTimeH(new Date(data['hourly'][i]['dt'] * 1000))
                    }
                })
                .catch(error => console.error(error));
        })
}

function formatTimeH(date) {
    console.log(date)
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let amorpm = hours >= 12 ? "PM" : "AM"

    hours = (hours % 12) || 12;

    return `${day}/${month}  ${hours}:${minutes} ${amorpm}`
}

getLocation.addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        fetch(`https://us1.locationiq.com/v1/reverse.php?key=pk.06932791bf8691ae00981592197e62fb&lat=${lat}&lon=${long}&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data['address']['city']) {
                    document.getElementById('location').innerHTML = data['address']['city']
                }
                else {
                    document.getElementById('location').innerHTML = data['address']['village']
                }
            })

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=metric&appid=9cd32b780681ffb235e82a9cd51e7b27`)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < 24; i++) {
                    let tempid = `htemp${i + 1}`
                    let dateid = `htime${i + 1}`
                    let iconid = data['hourly'][i]['weather'][0]['icon']

                    var img = document.createElement('img')
                    img.src = `http://openweathermap.org/img/wn/${iconid}@2x.png`

                    var div = document.getElementById(`himg${i + 1}`)
                    div.appendChild(img)

                    document.getElementById(tempid).innerHTML = data['hourly'][i]['temp']

                    document.getElementById(dateid).innerHTML = formatTimeH(new Date(data['hourly'][i]['dt'] * 1000))
                }
            })
            .catch(error => console.error(error));
    })
})

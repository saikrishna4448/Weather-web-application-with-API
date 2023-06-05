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

                    for (let i = 0; i < 7; i++) {
                        let tempid = `wtemp${i + 1}`
                        let tempday = `hday${i + 1}`
                        let iconid = data['daily'][i]['weather'][0]['icon']

                        var img = document.createElement('img')
                        img.src = `http://openweathermap.org/img/wn/${iconid}@2x.png`
                        var div = document.getElementById(`wimg${i + 1}`)
                        div.appendChild(img)

                        document.getElementById(tempday).innerHTML = formatDate(new Date(data['daily'][i]['dt'] * 1000))
                        document.getElementById(tempid).innerHTML = data['daily'][i]['temp']['day']
                    }
                })
                .catch(error => console.error(error));
        })
}

function formatDate(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    return `${day}-${month}-${year}`
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
                for (let i = 0; i < 7; i++) {
                    let tempid = `wtemp${i + 1}`
                    let tempday = `hday${i + 1}`
                    let iconid = data['daily'][i]['weather'][0]['icon']

                    var img = document.createElement('img')
                    img.src = `http://openweathermap.org/img/wn/${iconid}@2x.png`
                    var div = document.getElementById(`wimg${i + 1}`)
                    div.appendChild(img)

                    document.getElementById(tempday).innerHTML = formatDate(new Date(data['daily'][i]['dt'] * 1000))
                    document.getElementById(tempid).innerHTML = data['daily'][i]['temp']['day']
                }
            })
            .catch(error => console.error(error));
    })
})

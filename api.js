const searchBox = document.getElementById("searchbox");
let searchBoxValue
const getLocation = document.getElementById("get-location");
let variable = false;

document.getElementById("searchbox").addEventListener("keypress", (event) => {
    if (event.code === 'Enter') {
        if (variable)
            removeImages()

        variable = true;
        event.preventDefault();
        searchBoxValue = document.getElementById("searchbox").value

        getWeatherDetails()
    }
});


document.getElementById('searchbox2').addEventListener("keypress", (event) => {
    if (event.code === 'Enter') {
        if (variable)
            removeImages()
        variable = true;
        event.preventDefault();
        searchBoxValue = document.getElementById("searchbox2").value

        getWeatherDetails()
    }
});


getLocation.addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        fetch(`https://us1.locationiq.com/v1/reverse.php?key=pk.06932791bf8691ae00981592197e62fb&lat=${lat}&lon=${long}&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data['address']['city'])
                {
                    document.getElementById('city').innerHTML = data['address']['city']
                    document.getElementById('location').innerHTML = data['address']['city']
                }
                else
                {
                    document.getElementById('city').innerHTML = data['address']['village']
                    document.getElementById('location').innerHTML = data['address']['village']
                }
            })

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=metric&appid=9cd32b780681ffb235e82a9cd51e7b27`)
            .then(response => response.json())
            .then(data => {
                res = data
                console.log(data['current']['feels_like'])
                console.log(data)
                console.log(data['current']['weather'][0]['description'])

                document.getElementById('humidity').innerHTML = data['current']['humidity']
                document.getElementById('weather').innerHTML = data['current']['weather'][0]['description']
                document.getElementById('windspeed').innerHTML = data['current']['wind_speed']
                document.getElementById('temp').innerHTML = data['current']['temp']

                document.getElementById('feelslike').innerHTML = data['current']['feels_like']
                document.getElementById('date').innerHTML = formatTime(new Date())
                document.getElementById('sunrise').innerHTML = formatTime(new Date(data['current']['sunrise'] * 1000))
                document.getElementById('sunset').innerHTML = formatTime(new Date(data['current']['sunset'] * 1000))

                console.log(formatDate(new Date(data['current']['sunrise'] * 1000)))

                var img = document.createElement('img')
                img.src = 'http://openweathermap.org/img/wn/02d@2x.png'
                let i = 1
                var div = document.getElementById(`himg${i}`)
                div.appendChild(img)

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

                for (let i = 0; i<7; i++)
                    {
                        let tempid = `wtemp${i+1}`
                        let tempday = `hday${i+1}`
                        let iconid = data['daily'][i]['weather'][0]['icon']

                        var img = document.createElement('img')
                        img.src = `http://openweathermap.org/img/wn/${iconid}@2x.png`
                        var div = document.getElementById(`wimg${i + 1}`)
                        div.appendChild(img)

                        document.getElementById(tempday).innerHTML = formatDate(new Date(data['daily'][i]['dt']*1000))
                        document.getElementById(tempid).innerHTML = data['daily'][i]['temp']['day']
                    }
            })
            .catch(error => console.error(error));
    })
})

function getWeatherDetails() {
    fetch(`https://us1.locationiq.com/v1/search.php?key=pk.06932791bf8691ae00981592197e62fb&q=${searchBoxValue}&format=json`)
        .then(response => response.json())
        .then(data => {

            let lat = data[0]['lat']
            let long = data[0]['lon']
            document.getElementById('city').innerHTML = data[0]['display_name'].split(',')[0]
            document.getElementById('location').innerHTML = data[0]['display_name'].split(',')[0]

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&include=minutely,alerts&units=metric&appid=9cd32b780681ffb235e82a9cd51e7b27`)
                .then(response => response.json())
                .then(data => {
                    res = data
                    console.log(data['current']['feels_like'])
                    console.log(data)
                    console.log(data['current']['weather'][0]['description'])

                    document.getElementById('humidity').innerHTML = data['current']['humidity']
                    document.getElementById('weather').innerHTML = data['current']['weather'][0]['description']
                    document.getElementById('windspeed').innerHTML = data['current']['wind_speed']
                    document.getElementById('temp').innerHTML = data['current']['temp']
                    document.getElementById('feelslike').innerHTML = data['current']['feels_like']
                    document.getElementById('date').innerHTML = formatTime(new Date())
                    document.getElementById('sunrise').innerHTML = formatTime(new Date(data['current']['sunrise'] * 1000))
                    document.getElementById('sunset').innerHTML = formatTime(new Date(data['current']['sunset'] * 1000))

                    console.log(formatDate(new Date(data['current']['sunrise'] * 1000)))

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

                    for (let i = 0; i<7; i++)
                    {
                        let tempid = `wtemp${i+1}`
                        let tempday = `hday${i+1}`
                        let iconid = data['daily'][i]['weather'][0]['icon']

                        var img = document.createElement('img')
                        img.src = `http://openweathermap.org/img/wn/${iconid}@2x.png`
                        var div = document.getElementById(`wimg${i + 1}`)
                        div.appendChild(img)

                        document.getElementById(tempday).innerHTML = formatDate(new Date(data['daily'][i]['dt']*1000))
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

function formatTime(date) {
    console.log(date)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let amorpm = hours >= 12 ? "PM" : "AM"

    hours = (hours % 12) || 12;

    return `${hours}:${minutes} ${amorpm}`
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

function removeImages() {
    for(let i=0; i<24; i++)
    {
        var div = document.getElementById(`himg${i+1}`)
        var img = document.getElementById()
    }
}
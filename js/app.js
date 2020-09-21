'use strict'

/*
**********************************************************************************
Clock and Date
**********************************************************************************
*/

class TimeAndDay {
  time () {
    const clock = new Date()
    let hours = clock.getHours().toString()
    let seconds = clock.getSeconds().toString()
    let timeOfDay = 'AM'
    if (hours === '0') {
      hours = 12
    }
    if (hours >= 13) {
      hours -= 12
      timeOfDay = 'PM'
    }
    let minutes = clock.getMinutes().toString()
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return `${hours} : ${minutes} : ${seconds} ${timeOfDay}`
  }

  date () {
    const currentDate = new Date()
    const month = (currentDate.getMonth() + 1).toString()
    const day = currentDate.getDate().toString()
    const year = currentDate.getFullYear().toString()
    return (`${month}/${day}/${year}`)
  }
}

const Clock = new TimeAndDay()

const htmlClock = document.querySelector('[data-clock]')
htmlClock.textContent = Clock.time()
setInterval(() => { htmlClock.textContent = Clock.time() }, 1000)

const htmlDate = document.querySelector('[data-date]')
htmlDate.textContent = Clock.date()
setInterval(() => { htmlDate.textContent = Clock.date() }, 60000)
/*
**********************************************************************************
API retrival openweathermap.org (weather)
**********************************************************************************
*/

async function retreiveWeatherData (cityName) {
  const apiKey = '31759cea202400ba7057c6bff8ef1f8a'
  const weatherResponse = await window.fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`, {
    method: 'GET',
    headers: {

    }
  })
  try {
    const weatherJson = await weatherResponse.json()
    console.log(weatherJson)
    console.log(weatherJson.name)
    return weatherJson
  } catch { return (err) => console.log(err) }
}

async function changeDisplay (weatherJson) {
  const weatherResponse = await weatherJson

  const cityName = document.querySelector('[data-cityName]')
  cityName.textContent = weatherResponse.name

  const weatherDescription = document.querySelector('[data-weatherDescription]')
  weatherDescription.textContent = weatherResponse.weather[0].description

  const temp = document.querySelector('[data-temp]')
  temp.textContent = Math.round(((weatherResponse.main.temp) - 273.15) * (9 / 5) + 32) + ' °F'
}

/*
**********************************************************************************
API retrival Google places
**********************************************************************************
*/
// use the restictions in google to make it so the api key is only available from my website

/*this seems to only work for back end calls so I need to use javascript libary?
async function retrieveGoogleData (input) {
  const googlePlacesAPI = 'AIzaSyDforlHJAJsBfFmwmAHUmnTgXOzU5dDq5U'
  input = 'cleveland'

  const googleUri = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
  const googleParameters = `?key=${googlePlacesAPI}&input=${input}&inputtype=textquery`
  const googleAPIRequest = googleUri + googleParameters

  const options = {
    method: 'GET',
    mode: 'cors',
    ContentType: 'application/json',
    AccessControlAllowOrigin: '*'
  }

  console.log(googleAPIRequest)
  const fetchGoogle = fetch(googleAPIRequest, options)
  const response = await fetchGoogle
  console.log(response)
}
retrieveGoogleData()
*/

async function initMap () {
  let map
  let citySearch = async function getFormData () {
    await getCityInfo()
  }
  console.log(citySearch)
  let container = document.querySelector('[data-container]')
  let googlePhoto = document.createElement('p')
  googlePhoto.style.backgroundRepeat = 'no-repeat'
  container.appendChild(googlePhoto)

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.886, lng: 151.196 },
    zoom: 1
  })
  function createMarker (place) {
    const marker = new google.maps.Marker({
      position: place.geometry.location, 
      map: map
    })
  }
  createMarker() // add search peramitier
  const service = new google.maps.places.PlacesService(map)
  const request = {
    fields: ['name', 'photos'],
    query: 'houston'
  }
  service.findPlaceFromQuery(request, function (results, status) {
    console.log(google.maps.places.PlacesServiceStatus.OK)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        console.log(results[i])
        console.log(results[0].photos[0].getUrl())
      }
      googlePhoto.style.backgroundPosition = 'center'
      googlePhoto.style.backgroundImage = `url( ${results[0].photos[0].getUrl()} )`
      googlePhoto.style.height = `${results[0].photos[0].height}px`
      googlePhoto.style.width = `${results[0].photos[0].width}px`
    } else if (status === false) {
      Error('PlaceServiceStatus returned an value of false')
    } else {
      Error('something may be wrong with the request please check spelling or for full name of location')
    }
  })
}

/*
**********************************************************************************
form for user weather request data
**********************************************************************************
*/

async function submitCityForm (form, event) {
  if (event !== undefined) {
    event.preventDefault()
  }
  console.log(form)
  const cityData = new FormData(form)
  const cityInput = cityData.get('cityInput')
  changeDisplay(retreiveWeatherData(cityInput))
  return cityInput
}
async function getCityInfo () {
  console.log(document.forms.namedItem('form').name)
  const form = document.forms.namedItem('form')
  form.onsubmit = submitCityForm(form)
  return
  if (typeof submitCityForm(form) === 'string') {
    resolve 
  }
}
getCityInfo()
console.log()

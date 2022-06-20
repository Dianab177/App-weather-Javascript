function newDay(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hour}:${minutes}`;
}
function formatDaysForecast(dateStamp) {
  let date = new Date(dateStamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function infoTemperature(response) {
  let tempElement = document.querySelector("#degrees");
  let cityElement = document.querySelector("#city");
  let infoElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#weather-icon");
  let maxElement = document.querySelector("#max-degrees");
  let date = document.querySelector("#date");

  date.innerHTML = newDay(new Date());
  celsiusDegrees = response.data.main.temp;
  tempElement.innerHTML = Math.round(celsiusDegrees);
  cityElement.innerHTML = response.data.name;
  infoElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  maxElement.innerHTML = Math.round(response.data.main.temp);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function weekForecast(response) {
  let forecast = response.data.daily;

  let forecastDisplay = document.querySelector("#week-forecast");

  let forecastHtml = `<div class="row">`;
  forecast.forEach(function (forecastDaily, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="col-2">
      <div class="date-forecast">${formatDaysForecast(forecastDaily.dt)}</div>
      <img src="http://openweathermap.org/img/wn/${
        forecastDaily.weather[0].icon
      }@2x.png"
       alt=""
       width="36"/>
      <div class="degrees-forecast">
      <samp class="max-temp-forecast">${Math.round(
        forecastDaily.temp.max
      )}º</samp>
      <samp class="min-temp-forecast">${Math.round(
        forecastDaily.temp.min
      )}º</samp>
     </div>
     </div>`;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  forecastDisplay.innerHTML = forecastHtml;
}
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "a3c3f210b30127cb5ef5c59041b27e29";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(weekForecast);
}

function searchInfo(city) {
  let apiKey = "a3c3f210b30127cb5ef5c59041b27e29";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(infoTemperature);
}

function submit(event) {
  event.preventDefault();
  let formSearch = document.querySelector("#search-text");
  searchInfo(formSearch.value);
}

function showPosition(position) {
  let apiKey = "a3c3f210b30127cb5ef5c59041b27e29";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(geoApiUrl).then(infoTemperature);
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function fahrenheitElement(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#degrees");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let fahrenheitTemp = (celsiusDegrees * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}
function celsiusElement(event) {
  event.preventDefault();
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  let tempElement = document.querySelector("#degrees");
  tempElement.innerHTML = Math.round(celsiusDegrees);
}
let celsiusDegrees = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", submit);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", fahrenheitElement);

let celsius = document.querySelector("#celsius");
fahrenheit.addEventListener("click", celsiusElement);

let getCurrentIcon = document.querySelector("#geolocation");
getCurrentIcon.addEventListener("click", getPosition);

searchInfo("Buenos Aires");

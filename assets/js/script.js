import {API_KEY} from "./key.js";


const weatherApi= {
    key:API_KEY,
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    unit:"metric"
}
    
const box=document.querySelector('.box');
let inputSection=box.querySelector('.inputSection');
let alertBox= inputSection.querySelector('.alert');
let inputText=inputSection.querySelector('input');
let locationBtn=document.getElementById('locationButt');
let weatherBody=document.getElementById('weather-bodySection');
let backIcon=document.getElementById('icon');
let temp, min_temp, max_temp;

inputText.addEventListener('keypress', (event) =>{
    if(event.key =="Enter" && inputText!= "")
    {
        alertBox.innerHTML=`<div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div> <span> Getting weather details...`;
        alertBox.classList.add('pending');
        requestApi(inputText.value);
    }
});

locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    }
    else{
        alert('Your browser do not support geolocation API');
    }
});

function onSucess(position)
{
    const lat=position.coords.latitude;
    const lon=position.coords.longitude;
    //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    let api=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApi.key}&units=${weatherApi.unit}`;
    fetch(api).then((response)=>{return response.json()}).then(result=> showWheather(result));
}

function onError(error)
{
    console.log(error.message);
    alertBox.textContent=error.message;
    alertBox.classList.add('error');
}

function requestApi (city)
{
    //"http://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
    let api=`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`;
    fetch(api).then((response)=>{return response.json()}).then(result=> showWheather(result));
}

function showWheather(info)
{
    console.log(info);
    if(info.cod==404)
    {
        alertBox.textContent="Please enter valid city name"
        alertBox.classList.replace('pending', 'error');
    }
    else{
        if(info.sys.country==undefined)
        {
            document.getElementById("city").innerText= `${info.name}`;
        }
        else
        {
            document.getElementById("city").innerText= `${info.name}, ${info.sys.country}`;
        }

        let id=info.weather[0].icon;
        document.getElementById('condImage').src=`http://openweathermap.org/img/wn/${id}@2x.png`;
        inputText.value = info.name;


        if(id[2]=="n")
        {
            document.getElementById('sun').src="images/moon.gif";
            document.body.style.backgroundColor="#151844";
        }
        else{
            document.getElementById('sun').src="images/sun.gif";
            document.body.style.backgroundColor="#48befe";
        }

        temp= info.main.temp;
        min_temp= info.main.temp_min;
        max_temp= info.main.temp_max;
        document.getElementById("temp").innerText= `${Math.floor(info.main.temp)}°C`;
        document.getElementById("condition").innerText= `${info.weather[0].main}`;
        document.getElementById("humidity").innerText= `Humidity: ${info.main.humidity}%`;
        document.getElementById("wind").innerText= `Wind: ${info.wind.speed} Km/hr`;
        document.getElementById("pressure").innerText= `Pressure: ${info.main.pressure} mb`;
        document.getElementById("max-temp").innerText= `Max Temperature: ${Math.floor(info.main.temp_max)}°C`;
        document.getElementById("min-temp").innerText= `Min Temperature: ${Math.floor(info.main.temp_min)}°C`;

        alertBox.classList.remove('pending');
        alertBox.classList.remove('error');
        weatherBody.style.display="block";
    }
}


document.getElementById('fahrenhit').addEventListener('click', (event)=>{
    const temp1=temp*1.8+32;
    const max_temp1=(max_temp)*1.8+32;
    const min_temp1=(min_temp)*1.8+32;
    document.getElementById("temp").innerText=`${Math.floor(temp1)}°F`;
    document.getElementById("max-temp").innerText=`Max Temperature: ${Math.floor(max_temp1)}°F`;
    document.getElementById("min-temp").innerText=`Min Temperature: ${Math.floor(min_temp1)}°F`;
    event.target.previousElementSibling.classList.remove('active');
    event.target.classList.add('active');
});

document.getElementById('celcius').addEventListener('click', (event)=>{
    document.getElementById("temp").innerText=`${Math.floor(temp)}°C`;
    document.getElementById("max-temp").innerText=`Max Temperature: ${Math.floor(max_temp)}°C`;
    document.getElementById("min-temp").innerText=`Min Temperature: ${Math.floor(min_temp)}°C`;
    event.target.nextElementSibling.classList.remove('active');
    event.target.classList.add('active');
});
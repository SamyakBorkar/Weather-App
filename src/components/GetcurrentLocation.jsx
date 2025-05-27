import React, { useEffect, useState } from 'react'
import axios from 'axios';
import apiKeys from './apiKey.js'
import loader from '../assets/WeatherIcons.gif'
import natureCardImage from '../assets/nature.jpg'
import Clock from './Clock.jsx';
import ReactAnimatedWeather from 'react-animated-weather'
import Forecast from './Forecast.jsx';

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const GetcurrentLocation = () => {
    const[weatherData, setWeatherData]=useState({
    lat: null,
    lon: null,
    city: "",
    country: "",
    temperatureC: null,
    temperatureF: null,
    humidity: null,
    main: "",
    icon: "CLEAR_DAY",
    });

    const getPosition =(options)=>{
      return new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      })
    };

    const getWeatherInfo = async(latitude, longitude)=>{
      try{
        const res = await axios.get(
      `${apiKeys.base}weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          units: "metric",
          APPID: apiKeys.key
        }
      }
    );
    const data = res.data;
    let iconname = "CLEAR_DAY";
    switch(data.weather[0].main){
        case "Haze": iconname = "CLEAR_DAY"; break;
        case "Clouds": iconname = "CLOUDY"; break;
        case "Rain": iconname = "RAIN"; break;
        case "Snow": iconname = "SNOW"; break;
        case "Dust": iconname = "WIND"; break;
        case "Drizzle": iconname = "SLEET"; break;
        case "Fog":
        case "Smoke": iconname = "FOG"; break;
        case "Tornado": iconname = "WIND"; break;
        default: iconname = "CLEAR_DAY";
    }

     setWeatherData({
        latitude,
        longitude,
        city: data.name,
        country: data.sys.country,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        icon: iconname,
      });
      }
      catch(err){
        console.log("Error Fetching weather Info:",err);
      }
    };

    useEffect(()=>{
      if(navigator.geolocation){
        getPosition()
        .then((position)=>{
          getWeatherInfo(position.coords.latitude, position.coords.longitude);
        })
        .catch((err)=>{
          getWeatherInfo(28.67, 77.22); //Delhi Default
          alert("You have disabled location service. Your default location will be used.",err)
        })
      }
      else{
        alert("Geolocation not Available");
      }
      const interval = setInterval(()=>{
        if(weatherData.latitude && weatherData.longitude){
          getWeatherInfo(weatherData.latitude, weatherData.longitude);
        }
      },600000);

      return()=>{ clearInterval(interval)}
    },[weatherData.latitude, weatherData.longitude]);
  return weatherData.temperatureC ? (
  <div className="flex flex-col md:flex-row w-[90vw] max-w-6xl mx-auto my-10 rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900 text-white">
    <div
      className="md:w-1/2 bg-cover bg-center flex flex-col justify-between p-8"
      style={{ backgroundImage: `url(${natureCardImage})` }}
    >
      <div>
        <h2 className="text-5xl md:text-6xl font-bold">{weatherData.city}</h2>
        <h1 className="text-3xl md:text-4xl uppercase tracking-wider text-gray-200">{weatherData.country}</h1>
      </div>

      <div className="flex justify-between items-center mt-10">
        <div className="text-lg md:text-xl">
          <Clock />
          <div>{dateBuilder(new Date())}</div>
        </div>
        <div className="text-6xl font-bold">
          {weatherData.temperatureC}°<span className="text-2xl">C</span>
        </div>
      </div>
    </div>

    <div className="md:w-1/2  bg-gradient-to-br from-blue-800 to-indigo-900 p-6 md:p-10 flex flex-col justify-center items-center">
      <Forecast icon={weatherData.icon} weather={weatherData.main} />
    </div>
  </div>
) : (
  <div className="flex flex-col items-center justify-center min-h-screen text-white text-center space-y-4 bg-[#1c1c1c]">
    <img
      src={loader}
      alt="loading..."
      className="w-1/3 pointer-events-none select-none animate-pulse"
    />
    <h3 className="text-xl font-semibold">Detecting your location</h3>
    <h3 className="text-md text-gray-400">Your current location will be used for real-time weather.</h3>
  </div>
);

}

export default GetcurrentLocation
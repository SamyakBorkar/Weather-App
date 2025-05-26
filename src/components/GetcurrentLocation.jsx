import React, { useEffect, useState } from 'react'
import axios from 'axios';
import apiKeys from './apiKey.js'
// import loader from '../assets/WeatherIcons.gif'
import natureCardImage from '../assets/nature.jpg'
import Clock from './Clock.jsx';

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
const defaults = {
  color: "white",
  size: 112,
  animate: true,
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
  return (
    <>
    <div className='bg-[#1c1c1c] w-[70vw] h-[70vh] flex text-white'>
      <div className='w-[50%] bg-cover bg-center flex flex-col justify-between' style={{backgroundImage : `url(${natureCardImage})`}}>
        <div className='mt-10 px-7 w-[68%]'>
        <h2 className='text-8xl font-bold'>{weatherData.city}</h2>  
        <h1 className='text-6xl font-bold uppercase'>{weatherData.country}</h1>
        </div>
        <div className='flex h-[20%] items-center justify-center'>
          <div className=' w-[50%] flex flex-col items-center text-2xl'>
              <Clock />
              {dateBuilder(new Date())}
          </div>
          <div className='w-[50%] text-6xl font-bold flex items-center justify-center'>
            {weatherData.temperatureC}°<span className='text-3xl'>C</span>
          </div>
        </div>
      </div>
      <div className=' w-[50%]'>
        this is forecast wala div 
      </div>
    </div>
    </>
  )
}

export default GetcurrentLocation
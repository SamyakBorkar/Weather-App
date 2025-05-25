import React, { useState, useEffect } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

// Format date as string
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

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
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

  const getPosition = (options) =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await res.json();

      let iconName = "CLEAR_DAY";
      switch (data.weather[0].main) {
        case "Haze": iconName = "CLEAR_DAY"; break;
        case "Clouds": iconName = "CLOUDY"; break;
        case "Rain": iconName = "RAIN"; break;
        case "Snow": iconName = "SNOW"; break;
        case "Dust": iconName = "WIND"; break;
        case "Drizzle": iconName = "SLEET"; break;
        case "Fog":
        case "Smoke": iconName = "FOG"; break;
        case "Tornado": iconName = "WIND"; break;
        default: iconName = "CLEAR_DAY";
      }

      setWeatherData({
        lat,
        lon,
        city: data.name,
        country: data.sys.country,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        icon: iconName,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          fetchWeather(28.67, 77.22); // Default to Delhi
          alert(
            "You have disabled location service. Your default location will be used.", err
          );
        });
    } else {
      alert("Geolocation not available");
    }

    const interval = setInterval(() => {
      if (weatherData.lat && weatherData.lon) {
        fetchWeather(weatherData.lat, weatherData.lon);
      }
    }, 600000); // Refresh every 10 minutes

    return () => clearInterval(interval); // Cleanup
  }, [weatherData.lat, weatherData.lon]);

  return weatherData.temperatureC ? (
    <>
      <div className="text-white text-center p-6">
        <div className="mb-6">
          <h2 className="text-4xl font-bold">{weatherData.city}</h2>
          <h3 className="text-xl font-medium">{weatherData.country}</h3>
        </div>

        <div className="flex flex-col items-center mb-6">
          <ReactAnimatedWeather
            icon={weatherData.icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p className="text-lg mt-2">{weatherData.main}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg">
          <div className="mb-4 md:mb-0">
            <div className="text-3xl font-mono">
              <Clock format="HH:mm:ss" interval={1000} ticking={true} />
            </div>
            <div className="text-lg mt-2">{dateBuilder(new Date())}</div>
          </div>
          <div className="text-5xl font-bold">
            {weatherData.temperatureC}°<span className="text-2xl">C</span>
          </div>
        </div>
      </div>

      <Forcast icon={weatherData.icon} weather={weatherData.main} />
    </>
  ) : (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-white text-center space-y-4">
        <img
          src={loader}
          alt="loading..."
          className="w-1/2 pointer-events-none select-none"
        />
        <h3 className="text-xl font-semibold">Detecting your location</h3>
        <h3 className="text-md">Your current location will be used for real-time weather.</h3>
      </div>
    </>
  );
};

export default Weather;
  
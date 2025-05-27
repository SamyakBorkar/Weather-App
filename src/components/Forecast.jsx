import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import Search_png from "../assets/icons8-search-128.png";
import apiKeys from "./apiKey";

const Forecast = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${
          city !== "[object Object]" ? city : query
        }&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setWeather({});
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    search("Delhi");
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-800 to-indigo-900 text-white p-6 flex flex-col items-center">
      <div className="mb-6">
        <ReactAnimatedWeather
          icon={
            weather.weather ? weather.weather[0].main.toUpperCase() : "CLEAR_DAY"
          }
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>

      <h2 className="text-3xl font-semibold mb-4">
        {weather.name ? `${weather.name}, ${weather.sys.country}` : "Weather App"}
      </h2>

      <div className="flex items-center w-full max-w-md bg-white/10 rounded-lg px-4 py-2 mb-8">
        <input
          type="text"
          className="flex-grow bg-transparent outline-none text-white placeholder-white"
          placeholder="Search any city"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <img
          src={Search_png}
          alt="Search"
          className="h-6 w-6 cursor-pointer"
          onClick={() => search(query)}
        />
      </div>

      <div className="w-full max-w-md">
        <ul className="space-y-3 text-lg">
          {typeof weather.main !== "undefined" ? (
            <>
              <li className="flex justify-between items-center border-b border-white/20 pb-2">
                <span>Temperature</span>
                <span className="font-semibold">
                  {Math.round(weather.main.temp)}°C ({weather.weather[0].main})
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-white/20 pb-2">
                <span>Humidity</span>
                <span className="font-semibold">
                  {weather.main.humidity}%
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-white/20 pb-2">
                <span>Visibility</span>
                <span className="font-semibold">
                  {weather.visibility} mi
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-white/20 pb-2">
                <span>Wind Speed</span>
                <span className="font-semibold">
                  {weather.wind.speed} Km/h
                </span>
              </li>
            </>
          ) : (
            error && (
              <li className="text-red-400 font-medium">
                {error.query} {error.message}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Forecast;

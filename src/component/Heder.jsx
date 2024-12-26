import { useState } from "react";
import axios from "axios";

const Heder = () => {
  const [city, setCity] = useState("Tehran");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "2b3f3e9e4e0713236de1be2371544afc";

  // واکشی آب و هوای فعلی
  const fetchWeather = async () => {
    try {
      setError(null);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
      );
      setWeather(res.data);
      fetchForecast(); // فراخوانی پیش‌بینی بعد از موفقیت واکشی آب و هوا
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("اطلاعات موجود نیست");
    }
  };

  // واکشی پیش‌بینی چندروزه
  const fetchForecast = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fa`
      );
      // ذخیره پیش‌بینی ۵ روز آینده
      const dailyForecast = res.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
    } catch (err) {
      console.error("Error fetching forecast data:", err);
    }
  };

  return (
    <div className="weather-app bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto text-white relative overflow-hidden">
      {/* انیمیشن خورشید و ابر */}
      <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full animate-spin-slow"></div>
      <div className="absolute top-8 right-8 w-16 h-8 bg-white/40 rounded-full blur-lg"></div>

      <h1 className="relative text-3xl font-extrabold text-center mb-6 drop-shadow-lg">
        نمایش وضعیت آب و هوا
      </h1>

      {/* نمایش زمان و تاریخ */}
      <p className="text-center text-sm text-cyan-300 mb-4 relative z-10">
        {new Date().toLocaleDateString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="relative z-10 flex flex-col gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="نام شهر را وارد کنید"
          className="border-2 border-white rounded-lg p-3 bg-transparent placeholder-white text-white focus:outline-none focus:ring-4 focus:ring-cyan-500 transition-all"
        />
        <button
          onClick={fetchWeather}
          className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 transition-all duration-500 text-white font-bold rounded-lg p-3 shadow-lg hover:shadow-cyan-500/50"
        >
          دریافت وضعیت آب و هوا
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-center mt-6 font-semibold relative z-10 drop-shadow-lg">
          {error}
        </p>
      )}

      {weather && (
        <div className="weather-info relative z-10 mt-8 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold drop-shadow-md">
            آب و هوای {weather.name}
          </h2>
          <p className="text-lg mt-3 flex items-center gap-2 drop-shadow-sm">
            <span className="material-icons text-yellow-400">thermostat</span>
            دما: {weather.main.temp}°C
          </p>
          <p className="text-lg mt-1 flex items-center gap-2 drop-shadow-sm">
            <span className="material-icons text-blue-400">water_drop</span>
            وضعیت: {weather.weather[0].description}
          </p>
          <p className="text-lg mt-1 flex items-center gap-2 drop-shadow-sm">
            <span className="material-icons text-gray-300">air</span>
            سرعت باد: {weather.wind.speed} m/s
          </p>
        </div>
      )}

      {/* پیش‌بینی چندروزه */}
      {forecast && (
        <div className="forecast mt-8 bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">پیش‌بینی چندروزه:</h3>
          <div className="grid grid-cols-2 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="text-center bg-white/20 p-3 rounded-lg shadow"
              >
                <p className="text-sm font-bold">
                  {new Date(day.dt_txt).toLocaleDateString("fa-IR", {
                    weekday: "long",
                  })}
                </p>
                <p className="text-sm">دما: {day.main.temp}°C</p>
                <p className="text-xs">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* افکت موج پایین صفحه */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-t-full blur-lg animate-wave"></div>
    </div>
  );
};

export default Heder;

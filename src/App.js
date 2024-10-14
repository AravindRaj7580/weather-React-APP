import './App.css';
import Search from './component/search/search';
import Forecast from './component/forecast/forecast';
import CurrentWeather from './component/current-weather/current-weather';
import { WEATHER_API_KEY } from './api';
import { WEATHER_API_URL } from './api';
import { useState , useEffect } from 'react';

function App() {
    const [currentWeather, setCurrentWeather] = useState(null);

    const [forecast, setForecast] = useState(null);

    // const handleOnSearchChange = (searchData) => {
    //     const [lat, lon] = searchData.value.split(" ");
    //     const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    //     const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    //     Promise.all([currentWeatherFetch, forecastFetch])
    //         .then(async (response) => {
    //             const weatherResponse = await response[0].json();
    //             const forcastResponse = await response[1].json();

    //             setCurrentWeather({ city: searchData.label, ...weatherResponse });
    //             setForecast({ city: searchData.label, ...forcastResponse });
    //         })
    //         .catch(console.log);
    // };

    const fetchWeatherData = (lat, lon, label = "your location") => {
        // const [lat, lon] = searchData.value.split(" ");
        const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
        const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

        Promise.all([currentWeatherFetch, forecastFetch])
            .then(async (response) => {
                const weatherResponse = await response[0].json();
                const forcastResponse = await response[1].json();

                setCurrentWeather({ city: label, ...weatherResponse });
                setForecast({ city: label, ...forcastResponse });
            })
            .catch(console.log);
    };

    // const getCurrentLocation = () => {
    //     if(navigator.geolocation){
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const {lattitude, longitude} = position.coords;
    //                 fetchWeatherData(lattitude, longitude);
    //             },
    //             (error) => {
    //                 console.error("Error fetching current location: ", error);
    //             }
    //         );
    //     }else{
    //         console.error("Geolocation is not supported by this browser.");
    //     }
    // };

    useEffect( () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    if(latitude && longitude){
                        console.log("Current latitude: ", latitude);
                        console.log("Current longitude: ", longitude);
                        fetchWeatherData(latitude, longitude);
                    }else{
                        console.error("latitude or longitude is undefined");
                    }
                },
                (error) => {
                    console.error("Error fetching current location: ", error);
                }
            );
        }else{
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleOnSearchChange = (searchData) => {
        const [lat, lon] = searchData.value.split(" ");
        fetchWeatherData(lat, lon, searchData.label);
    };

    // handleOnSearchChange

    return (
        <div className='container'>
            <Search onSearchChange={handleOnSearchChange} />
            {currentWeather && <CurrentWeather data = {currentWeather}/>}
            {forecast && <Forecast data={forecast} />}
        </div>
        // <h1>Hello world</h1>
    );
}

export default App;
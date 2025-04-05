'use client'
import { useEffect, useState } from "react"
import axios from "axios";
function App() {
const [cityName,getCityName] = useState<string>('');
const [state,getState] = useState<string[]>([]);
const [stateStatus,getStateStatus] = useState<Boolean>(false);
const [selectState, getSelectState] = useState<string>('');
const [weather, getWeather] = useState<string>('');
const [temperature, getTemperature] = useState<string>('');
const [humidity, getHumidity] = useState<string>('');
const [countryCode, getCountryCode] = useState<string>('');
const [icon,getIcon] = useState<string>('');
const [fetchedCityName, getFetchedCityName] = useState<string>('');

const cityValueFetcher = async() => {
  if(!cityName){
    alert('Please Enter City Name');
    return;
  }
  else{
    try {
      await axios.post('http://localhost:3000/api', {
          cityName: cityName
      });
      const response = await axios.get('http://localhost:3000/api'); 
      getState(response.data.State);
      getSelectState(response.data.State[0]);
      getStateStatus(true); 
      
  } catch (error) {
    console.error(error);
  }
 

 // multi lanuage

  }
}


const weatherResponseHandler = async() => {
  try{
    await axios.post('http://localhost:3000/api', {
      cityName: cityName, stateName: selectState   
  });
  const response = await axios.get('http://localhost:3000/api'); 
  getWeather(response.data.WeatherInfo.weather[0].main);
  getTemperature(response.data.WeatherInfo.main.temp);
  getHumidity(response.data.WeatherInfo.main.humidity);
  getCountryCode(response.data.WeatherInfo.sys.country);
  getIcon(response.data.Icon);
  getFetchedCityName(response.data.WeatherInfo.name);
  

  }
  catch(error){
    console.log(error);
  }

}



useEffect(()=>{
  if(selectState){
    weatherResponseHandler();
  }
},[selectState])
     

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 text-white p-6">
    <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-4">🌤️ Weather App</h1>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={cityName}
          onChange={(e) => getCityName(e.target.value)}
          placeholder="Enter city name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={cityValueFetcher}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Check
        </button>
      </div>

      {stateStatus && (
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold">Select State:</label>
          <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1" onChange={(e) => {getSelectState((e.target as HTMLSelectElement).value)}}>
            {state.map((state, index) => (
              <option key={index} value={state} >
                {state}
              </option>
            ))}
          </select>
        </div>
      )}
      {stateStatus && (
  <div className="p-4 bg-gray-100 rounded-lg shadow-md text-gray-800">
    <div className="flex items-center">
    <p className="text-lg font-semibold">{weather}</p> 
    <img src={icon} alt="weather_image" width={40} height={40}/>
    </div>
    <hr className="my-1 -mt-1 border-t border-gray-300" />
    <p className="text-lg font-medium">
      {temperature}°C in {fetchedCityName}, {selectState}
    </p>
    <p className="text-sm">Humidity: {humidity}%</p>
    <p className="text-xs text-gray-600">Country Code: {countryCode}</p>
  </div>
)}

      </div>
  </div>
   
  )
}

export default App

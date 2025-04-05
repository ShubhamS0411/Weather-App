import dotenv from 'dotenv';
import Cors from 'cors';
import express from 'express';
const app = express();
import axios from 'axios';


dotenv.config();
app.use(Cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})  
let CityWeatherInfo;
app.post('/api', async (req, res) => {
    let {cityName, stateName} = req.body;
   
   
    if(!cityName){
        res.status(400).json({error: 'Please Enter City Name'});
    }

    cityName = cityName[0].toUpperCase() + cityName.slice(1);
      
      
    try {
        const responseFORCITY = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.cityName}&limit=20&appid=${process.env.API_KEY}`);
        const fetchAllStates = responseFORCITY.data.map((state) => state.state).filter((state)=>state);
        const removeDuplicateStates = [... new Set(fetchAllStates)];
        CityWeatherInfo = {
            State: removeDuplicateStates
        } 
        
        if(stateName){
        const lat = responseFORCITY.data.filter((data)=> data.state === stateName).filter((data,index,array)=> data.state === array[index+1]?.state ? false: true).map((data)=> data.lat);
        const lon = responseFORCITY.data.filter((data)=> data.state === stateName).filter((data,index,array)=> data.state === array[index+1]?.state ? false: true).map((data)=> data.lon);
        const responseForWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`);
        const iconURL = `https://openweathermap.org/img/wn/${responseForWeather.data.weather[0].icon}@2x.png`
        CityWeatherInfo = {
            WeatherInfo: responseForWeather.data,
            State: removeDuplicateStates,
            Icon: iconURL
            
        }  
        }
        res.status(200).json({message: 'success'});  
    } catch (error) {
        console.log(error);
    }
})

    app.get('/api', (req, res) => {
        
        try{
        res.status(200).json(CityWeatherInfo);
      
        }
        catch(error){
            console.log(error);
        }

})


const PORT =  process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
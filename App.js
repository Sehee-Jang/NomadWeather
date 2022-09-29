import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'; 
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = `d1ab66bc3d56f5b0ac207cdae03b249e`;

const icons = {
  "Clouds": "cloudy",
  "Clear": "day-sunny",
  "Rain": "rains",
  "Thunderstorm": "lightning",
  "Snow": "snow",
  "Drizzle": "rain",
  "Atmosphere": "cloudy-gusts", 
}
export default function App() {
  const [city, setCity] = useState(["Loading..."]) 
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) { 
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },  
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
    );
    const json = await response.json();
    setDays(json.list);
  }; 
  useEffect(() => { 
    getWeather();
  }, [])
  return (

    <View style={styles.container}>
      
      <View style={styles.city}>
        <Text style={styles.cityName}>{ city }</Text>
      </View>
      
      <ScrollView
        horizontal /* 가로 스크롤 */
        pagingEnabled /* 스크롤뷰를 페이지처럼 생성 */
        showsHorizontalScrollIndicator={false} /* 스크롤뷰 아래 indicator 없앰  */
        contentContainerStyle={styles.weather}> 
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>   
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
              
              <View style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginTop: 50,
              }}>
                <Fontisto name={icons[day.weather[0].main]} style={ styles.icon } color="black" />
                <Text style={ styles.description }>{day.weather[0].main}</Text>
              </View>
              
              <Text style={ styles.smallDescription }>{day.weather[0].description}</Text>
            </View>
            )
        )}
        
      </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  city: {
    flex: 3.3,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: "500",
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 0,
    fontWeight: "600",
    fontSize: 150,
  },
  description: {
    fontSize: 50,
  },
  icon: {
    fontSize: 80,
  },
  smallDescription: {
    marginTop: 50,
    fontSize: 20,
  },
  
});

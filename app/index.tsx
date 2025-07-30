import { Image, StatusBar, StyleSheet, TextInput, TouchableOpacity, View,Text, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, weatherImages } from '../theme/idnex';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import {Ionicons} from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import debounce from 'lodash.debounce'
import { fetchLocations, fetchWeatherForecast } from '../api/weather'
import * as Progress from 'react-native-progress';
import {storeData,getData} from '../utils/asynce_storage'


type Weather = {
  location?: {
    name?: string;
    country?: string;
  };
  current?: {
    temp_c?: number;
    condition?: {
      text?: string;
    };
    wind_kph?: number;
    humidity?: number;
  };
  forecast?: {
    forecastday: {
      date: string;
      day: {
        avgtemp_c: number;
        condition: {
          text: string;
        };
      };
      astro: {
        sunrise: string;
      };
    }[];
  };
};

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false)
  const [locations, setLocations] = useState([])
  const [weather , setWeather] = useState<Weather>({})
  const [loading ,setLoading ]= useState(false);
  const [cityName, setCityName] = useState('Sri Ganganagar');

  const handleLocation = (loc)=>{
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days:'7'
    }).then(data=>{
      setWeather(data);
      setLoading(false);
      storeData('city',loc.name);
    })
  }

  useEffect(()=>{
    fetchWeatherForecast({cityName ,days: '7'}).then(data=>setWeather(data));
  },[]);
  

  const handleSearch = value =>{
    if(value.length>2){
      fetchLocations({cityName: value}).then(data=>{
        setLocations(data);
      })
    }
  }

  const fetchMyWeatherData = async()=>{
    let myCity = await getData('city');
    let cityName = 'Sri Ganganagar'
    if(myCity){
      cityName =myCity;
    }
    fetchWeatherForecast({
      cityName,
      days:'7'
    }).then(data=>{
      setWeather(data)
      setLoading(false)
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

  const current = weather?.current ?? {};
  const location = weather?.location ?? {name:'Rajasthan',country:'India'};


  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#1e293b"
        barStyle="light-content"
        translucent={false}
      />
      <Image 
        source={require('../assets/images/bg.png')}
        style={styles.img}
        resizeMode="cover"
        blurRadius={70}
      />
      {
        loading?(
          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Progress.Circle thickness={moderateScale(20)} size={moderateScale(40)} color='#ffffff'/>
          </View>
        ):(
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.searchWrapper}>
              <View style={[styles.searchContainer, { backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }]}>
                <View style={styles.inputWrapper}>
                  {showSearch && (
                    <TextInput
                      onChangeText={handleTextDebounce}
                      placeholder="Search city"
                      placeholderTextColor="lightgray"
                      style={styles.textInput}
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={styles.btn}
                >
                  <FontAwesome6 name="magnifying-glass" size={22} color="white" />
                </TouchableOpacity>
              </View>
              {
                locations.length>0 && showSearch?(
                  <View style={styles.location}>
                    {
                      locations.map((loc, index)=>{
                        let showBorder = index+1 != locations.length;
                        let BorderClass = showBorder? {borderBottomWidth:2,borderBottomColor:'#9CA3AF'}:{};
                        return (
                          <TouchableOpacity key={index} 
                          onPress={()=> handleLocation(loc)}
                            style={[styles.location_input,showBorder && {borderBottomWidth: moderateScale(2),borderBlockColor: '#9CA3AF'}]}>
                            <Feather name="map" size={24} color="black"/>
                            <Text style={styles.location_text}>{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                      )})
                    }
                  </View>
                ):null
              }
            </View>
            //forecast section
            <View style={styles.forecast_container}>
              <Text style={styles.forecast_text1}>
                {location?.name},
                <Text style={styles.forecase_text2}>{" "+location?.country}</Text>
              </Text>
              <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Image
                  style={{ width: moderateScale(132), height: moderateScale(132) }}
                  source={
                    (current?.condition?.text &&
                    current.condition.text in weatherImages
                      ? weatherImages[current.condition.text as keyof typeof weatherImages]
                      : weatherImages['Sunny'])
                  }
                /> 
              </View>
              <View style={{gap:verticalScale(8)}}>
                <Text style={{textAlign:'center',fontWeight:'bold',color:'white',fontSize:moderateScale(64),marginLeft:scale(10)}}>{current?.temp_c}43&#176;</Text>
                <Text style={{textAlign:'center',color:'white',fontSize:moderateScale(20),marginLeft:scale(10),letterSpacing:moderateScale(2)}}>{current?.condition?.text}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:scale(8)}}>
                <View style={{flexDirection:'row',gap:scale(8), alignItems:'center'}}>
                  <Fontisto name="wind" size={moderateScale(24)} color="white" />
                  <Text style={{color:'white',fontSize:moderateScale(16),fontWeight:'600'}}>{current?.wind_kph}km</Text>
                </View>
                <View style={{flexDirection:'row',gap:scale(8), alignItems:'center'}}>
                  <SimpleLineIcons name="drop" size={moderateScale(24)} color="white" />
                  <Text style={{color:'white',fontSize:moderateScale(16),fontWeight:'600'}}>{current?.humidity}%</Text>
                </View>
                <View style={{flexDirection:'row',gap:scale(8), alignItems:'center'}}>
                  <Feather name="sun" size={moderateScale(24)} color="white" />
                  <Text style={{color:'white',fontSize:moderateScale(16),fontWeight:'600'}}>{weather?.forecast?.forecastday?.[0]?.astro?.sunrise || '--'}</Text>
                </View>
              </View>
            </View>
            //for next days
            <View style={{marginBottom:verticalScale(8),gap:verticalScale(12)}}>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:verticalScale(5),gap:scale(8),marginLeft:scale(16)}}>
                <FontAwesome6 name="calendar-days" size={moderateScale(22)} color="white" />
                <Text style={{color:'white', fontSize:moderateScale(16),}}>Daily Forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{paddingHorizontal: scale(10)}}
                showsHorizontalScrollIndicator={false}>
                  {
                    weather?.forecast?.forecastday?.map((item,index)=>{

                      let date = new Date(item.date);
                      let options = {weekday: 'long'}
                      let dayName = date.toLocaleDateString('en-US',options);
                      dayName = dayName.split(',')[0]

                      return(
                        <View 
                          key={index}
                          style={{flex:1,justifyContent:'center',alignItems:'center',width:scale(96),borderRadius:moderateScale(24),paddingVertical:verticalScale(15),marginRight:scale(16),backgroundColor:theme.bgWhite(0.15),marginBottom:verticalScale(4)}}>
                          <Image source={item?.day?.condition?.text in weatherImages? weatherImages[item?.day?.condition?.text] : weatherImages['Overcast']} style={{width:moderateScale(48),height:moderateScale(48),marginBottom:verticalScale(4)}}/>
                          <Text style={{color:'white',marginBottom:verticalScale(4)}}>{dayName}</Text>
                          <Text style={{color:'white', fontSize:moderateScale(20), fontWeight:'600',}}>{item?.day?.avgtemp_c}&#176;</Text>
                        </View>
                      )
                    })
                  }
              </ScrollView>
            </View>
        </SafeAreaView>
        )
      }
     
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  img: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  searchWrapper: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(16),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    paddingHorizontal: scale(12),
    height: verticalScale(46),
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: 'white',
  },
  btn:{
    backgroundColor:theme.bgWhite(0.3),
    borderRadius:9999,
    height:moderateScale(50),
    width:moderateScale(50),
    alignItems:'center',
    justifyContent:'center',
    marginRight:-10,
  },
  inputWrapper: {
    flex: 1,
  },
  location:{
    position:'absolute',
    width:'100%',
    backgroundColor:'#D1D5DB',
    marginTop:verticalScale(64),
    opacity:1,
    borderRadius: moderateScale(24),
    marginLeft:scale(15),
    elevation:4,
    shadowColor:'#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
  location_input:{
    flexDirection:'row',
    alignItems:'center',
    borderRadius:0,
    padding:moderateScale(12),
    paddingHorizontal:scale(4),
  },
  location_text:{
    color:'black',
    fontSize:18,
    marginLeft:8,
  },
  forecast_container:{
    marginHorizontal:scale(16),
    flex:1,
    justifyContent:'space-around',
    marginBottom: verticalScale(8),
  },
  forecast_text1:{
    color:'white',
    textAlign:'center',
    fontSize:moderateScale(24),
    fontWeight:'bold',
  },
  forecase_text2:{
    fontSize: moderateScale(18),
    fontWeight: '600',
    color:'#D1D5DB',
  }
});

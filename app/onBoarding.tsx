import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { setItem } from '@/utils/asynce_storage';

const OnBoarding = () => {
  const handleDone = async () => {
    await setItem('onboarded', '1');
    setTimeout(() => {
      router.replace('/homeScreen');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Onboarding
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        onDone={handleDone}
        onSkip={handleDone}
        containerStyles={{ paddingHorizontal: scale(15) }}
        pages={[
          {
            backgroundColor: '#a78bfa',
            image: (
              <LottieView
                source={require('../animatons/OXOLYc9qiw.json')}
                autoPlay
                loop
                resizeMode="contain"
                style={styles.lottie}
              />
            ),
            title: 'Welcome to Weather-Wise',
            subtitle: 'Stay prepared with real-time weather updates for your location and beyond.',
          },
          {
            backgroundColor: '#a7f3d0',
            image: (
              <LottieView
                source={require('../animatons/4oMw48tv1L.json')}
                autoPlay
                loop
                resizeMode="contain"
                style={styles.lottie}
              />
            ),
            title: 'Global & Local Forecasts',
            subtitle: 'Track the weather in your city or anywhere in the world — all in one app.',
          },
          {
            backgroundColor: '#fef3c7',
            image: (
              <LottieView
                source={require('../animatons/Q2sN01qh3H.json')}
                autoPlay
                loop
                resizeMode="contain"
                style={styles.lottie}
              />
            ),
            title: 'Smart Alerts & Insights',
            subtitle: 'Get instant alerts for storms, temperature changes, and more — right when you need them.',
          },
        ]}
      />
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lottie: {
    width: scale(300),
    height: verticalScale(350),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    paddingHorizontal: scale(10),
    marginTop: verticalScale(-30),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    paddingHorizontal: scale(10),
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
});

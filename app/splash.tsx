import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { getItem } from '@/utils/asynce_storage';

const SplashScreen = () => {
  const animationRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [onboarded, setOnboarded] = useState(null);

  useEffect(() => {
    const loadAppData = async () => {
      const onboardValue = await getItem('onboarded');
      setOnboarded(onboardValue);
      setIsReady(true);
    };

    loadAppData();
  }, []);

  const handleAnimationFinish = () => {
    if (isReady) {
      router.replace(onboarded?.toString() === '1' ? '/homeScreen' : '/onBoarding');
    } else {
      const checkReady = setInterval(() => {
        if (isReady) {
          clearInterval(checkReady);
          router.replace(onboarded === '1' ? '/homeScreen' : '/onBoarding');
        }
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../animatons/OXOLYc9qiw.json')}
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.lottie}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
});

import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { getItem } from '@/utils/asynce_storage';
import { ActivityIndicator, View } from 'react-native';

const Layout = () => {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    const onboarded = await getItem('onboarded');
    setShowOnboarding(onboarded !== '1');
  };

  if (showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={showOnboarding ? 'onBoarding' : 'homeScreen'}>
      <Stack.Screen name="homeScreen" />
      <Stack.Screen name="onBoarding" />
    </Stack>
  );
};

export default Layout;

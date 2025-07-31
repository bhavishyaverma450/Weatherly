import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
  useEffect(() => {
    router.replace('/splash');
  }, []);

  return <View />; 
}

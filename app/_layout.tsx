import { SplashScreen, Stack } from "expo-router";
import { useFonts, Kanit_400Regular, Kanit_700Bold } from '@expo-google-fonts/kanit';
import { useEffect } from "react";

export default function RootLayout() {

  //Load Google Font
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return <Stack screenOptions={{
    headerStyle:{
      backgroundColor:'#007aff',
    },
    headerTitleStyle:{
      fontSize: 20,
      color: '#fff',
      fontFamily: 'Kanit_700Bold',
    },
    headerTitleAlign: 'center',
    headerTintColor: '#fff',
    headerBackButtonDisplayMode: 'minimal',

  }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="run" options={{
      title: 'Run Tracker V1.0.0',
    }}/>
    <Stack.Screen name="add" options={{
      title: 'เพิ่มรายละเอียดการวิ่ง',
      }}/>
    <Stack.Screen name="[id]" options={{
      title: 'รายละเอียดการวิ่ง',
      }}/>
  </Stack>;
}



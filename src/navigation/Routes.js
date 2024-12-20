import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import SplashScreen from "react-native-splash-screen";
import SignUpScreen from '../screens/Signup';
import LoginScreen from '../screens/Login';
import NotificationScreen from '../screens/NotificationScreen';
import PhotoScreen from '../screens/PhotoScreen';
import TextScreen from '../screens/TextScreen';
import CalculatorScreen from '../screens/Calculator';
import LoadingScreen from '../screens/LoadingScreen';  // Create a loading screen to show while checking auth status
import ImageGalleryScreen from '../screens/Gallery';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#000' },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 10,
      },
      tabBarActiveTintColor: '#FF0000',
      tabBarInactiveTintColor: '#FFFFFF',
      tabBarLabelPosition: 'below-icon',
      tabBarShowLabel: true,  // Hide labels
      tabBarShowIcon: true,   // Show icons if you have them
      tabBarIcon: () => null, // Hide icons

    }}
  >
    {/* <Tab.Screen 
      name="Notification" 
      component={NotificationScreen} 
    /> */}
    <Tab.Screen 
      name="Image" 
      component={PhotoScreen} 
    />
    <Tab.Screen 
      name="Notes" 
      component={TextScreen} 
    />
    <Tab.Screen 
      name="Gallery" 
      component={ImageGalleryScreen} 
    />
  </Tab.Navigator>
);

const Routes = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  React.useEffect(()=>{
  
    SplashScreen.hide();        
  },[])
  // Handle user state changes
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return <LoadingScreen />;  // Show loading while checking auth

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false, // Hide header for all screens
        }}
      >
        {user ? (
          // If user is logged in, show main app
          <Stack.Screen 
            name="MainApp" 
            component={TabNavigator} 
            options={{ headerShown: false }}  // Ensure header is hidden for this screen
          />
        ) : (
          <>
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{ title: 'Sign Up', headerShown: false }}  // Ensure header is hidden for this screen
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Login', headerShown: false }}  // Ensure header is hidden for this screen
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

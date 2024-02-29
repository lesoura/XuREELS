import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker'; // Import Orientation module
import XuREELS from './screens/XuREELS';
import BlankPage from './screens/BlankPage';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    // Lock the orientation to portrait mode when the app starts
    Orientation.lockToPortrait();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName="XuREELS">
            <Stack.Screen
              name="XuREELS"
              component={XuREELS}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BlankPage"
              component={BlankPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

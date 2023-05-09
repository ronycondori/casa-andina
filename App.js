import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Recognition from './screens/CameraTest';
import Localization from './screens/Localization';
import Map from './screens/Map';
import FacialRecognition from './screens/FacialRecognition';

const Tab = createBottomTabNavigator();

function TabsNavigations() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="FacialRecognition"
        component={FacialRecognition}
        options={({ navigation }) => ({
          headerTitle: 'Casa Andina',
        })}
      />
      <Tab.Screen name="Localization" component={Localization} />
      <Tab.Screen name="Map" component={Map} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabsNavigations />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Home,
  Informasi,
  Obat,
  Splash,
  Register,
  Sukses,
  Login,
  ForgotPass,
  Video,
  PenunjangUser,
  DrugReferensi,
  DrugBerbayar
} from '../pages';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigator} from '../components';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{showLabel: false}}
      tabBar={props => <BottomTabNavigator {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Informasi" component={Informasi} />
      <Tab.Screen name="Notif" component={Obat} />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Sukses"
        component={Sukses}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Video"
        component={Video}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="PenunjangUser"
        component={PenunjangUser}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DrugReferensi"
        component={DrugReferensi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DrugBerbayar"
        component={DrugBerbayar}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;
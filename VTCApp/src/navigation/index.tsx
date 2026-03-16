import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Auth screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';

// Passenger screens
import { HomeScreen } from '../screens/passenger/HomeScreen';
import { BookingScreen } from '../screens/passenger/BookingScreen';
import { DispositionScreen } from '../screens/passenger/DispositionScreen';
import { BookForOtherScreen } from '../screens/passenger/BookForOtherScreen';
import { FavoriteDriversScreen } from '../screens/passenger/FavoriteDriversScreen';
import { TrackingScreen } from '../screens/passenger/TrackingScreen';
import { RatingScreen } from '../screens/passenger/RatingScreen';
import { HistoryScreen } from '../screens/passenger/HistoryScreen';
import { ProfileScreen } from '../screens/passenger/ProfileScreen';

// Driver screens
import { DriverHomeScreen } from '../screens/driver/HomeScreen';
import { ActiveRideScreen } from '../screens/driver/ActiveRideScreen';
import { DashboardScreen } from '../screens/driver/DashboardScreen';
import { DriverProfileScreen } from '../screens/driver/ProfileScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

import type {
  AuthStackParamList,
  PassengerStackParamList,
  PassengerTabParamList,
  DriverStackParamList,
  DriverTabParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const PassengerStack = createNativeStackNavigator<PassengerStackParamList>();
const PassengerTab = createBottomTabNavigator<PassengerTabParamList>();
const DriverStack = createNativeStackNavigator<DriverStackParamList>();
const DriverTab = createBottomTabNavigator<DriverTabParamList>();

// ─── Passenger navigation ─────────────────────────────────────────────────────

const PassengerStackNavigator = () => (
  <PassengerStack.Navigator screenOptions={{ headerShown: false }}>
    <PassengerStack.Screen name="Booking" component={BookingScreen} />
    <PassengerStack.Screen name="Disposition" component={DispositionScreen} />
    <PassengerStack.Screen name="BookForOther" component={BookForOtherScreen} />
    <PassengerStack.Screen name="FavoriteDrivers" component={FavoriteDriversScreen} />
    <PassengerStack.Screen name="Tracking" component={TrackingScreen} />
    <PassengerStack.Screen name="Rating" component={RatingScreen} />
    <PassengerStack.Screen name="Profile" component={ProfileScreen} />
  </PassengerStack.Navigator>
);

const PassengerTabNavigator = () => (
  <PassengerTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.gray,
      tabBarStyle: { borderTopColor: colors.border },
    }}
  >
    <PassengerTab.Screen
      name="PassengerHome"
      component={HomeScreen}
      options={{ tabBarLabel: 'Accueil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
    />
    <PassengerTab.Screen
      name="History"
      component={HistoryScreen}
      options={{ tabBarLabel: 'Courses', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }}
    />
    <PassengerTab.Screen
      name="PassengerStack"
      component={PassengerStackNavigator}
      options={{
        tabBarLabel: 'Commander',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 28, color }}>🚗</Text>,
        tabBarItemStyle: { backgroundColor: '#FFF0F0' },
      }}
    />
    <PassengerTab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
    />
  </PassengerTab.Navigator>
);

// ─── Driver navigation ────────────────────────────────────────────────────────

const DriverStackNavigator = () => (
  <DriverStack.Navigator screenOptions={{ headerShown: false }}>
    <DriverStack.Screen name="ActiveRide" component={ActiveRideScreen} />
  </DriverStack.Navigator>
);

const DriverTabNavigator = () => (
  <DriverTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.gray,
      tabBarStyle: { borderTopColor: colors.border },
    }}
  >
    <DriverTab.Screen
      name="DriverHome"
      component={DriverHomeScreen}
      options={{ tabBarLabel: 'Accueil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
    />
    <DriverTab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ tabBarLabel: 'Finances', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💰</Text> }}
    />
    <DriverTab.Screen
      name="DriverStack"
      component={DriverStackNavigator}
      options={{
        tabBarLabel: 'Course active',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛣️</Text>,
      }}
    />
    <DriverTab.Screen
      name="DriverProfile"
      component={DriverProfileScreen}
      options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
    />
  </DriverTab.Navigator>
);

// ─── Auth navigation ──────────────────────────────────────────────────────────

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="OTP" component={OTPScreen} />
  </AuthStack.Navigator>
);

// ─── Root navigator ───────────────────────────────────────────────────────────

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'passenger' ? (
        <PassengerTabNavigator />
      ) : (
        <DriverTabNavigator />
      )}
    </NavigationContainer>
  );
};

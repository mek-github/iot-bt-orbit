import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { getCurrentUser, getUserProfile } from './src/services/firebaseService';

// Screens
import { LoadingSplashScreen } from './src/screens/LoadingSplashScreen';
import { ProgressiveLoadingScreen } from './src/screens/ProgressiveLoadingScreen';
import { OrbitVisualizationScreen } from './src/screens/OrbitVisualizationScreen';
import { EventDiscoveryScreen } from './src/screens/EventDiscoveryScreen';
import { EventDetailScreen } from './src/screens/EventDetailScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { RoleSelectionScreen } from './src/screens/RoleSelectionScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HostDashboardScreen } from './src/screens/HostDashboardScreen';
import { EventCheckinsScreen } from './src/screens/EventCheckinsScreen';
import { CreateEventScreen } from './src/screens/CreateEventScreen';
import { RecruiterDashboardScreen } from './src/screens/RecruiterDashboardScreen';

export type RootStackParamList = {
  RoleSelection: undefined;
  Login: { role: 'attendee' | 'host' | 'recruiter' };
  LoadingSplash: undefined;
  ProgressiveLoading: { stage: 1 | 2 | 3 | 4 };
  OrbitVisualization: undefined;
  EventDiscovery: undefined;
  EventDetail: { event?: any };
  UserProfile: undefined;
  Search: undefined;
  HostDashboard: undefined;
  RecruiterDashboard: undefined;
  EventCheckins: { eventId: string; event: any };
  CreateEvent: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore errors preventing auto hide
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Simulate any async resource loading here
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="RoleSelection"
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            {/* Authentication Flow */}
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />

            {/* Attendee Flow */}
            <Stack.Screen name="LoadingSplash">
              {(props) => (
                <LoadingSplashScreen
                  {...props}
                  onLoadComplete={() => props.navigation.navigate('OrbitVisualization')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="ProgressiveLoading">
              {(props) => {
                const stage = props.route.params?.stage || 2;
                return (
                  <ProgressiveLoadingScreen
                    {...props}
                    stage={stage}
                    onLoadComplete={() => {
                      if (stage < 4) {
                        props.navigation.navigate('ProgressiveLoading', {
                          stage: (stage + 1) as 2 | 3 | 4,
                        });
                      } else {
                        props.navigation.navigate('OrbitVisualization');
                      }
                    }}
                  />
                );
              }}
            </Stack.Screen>

            <Stack.Screen name="OrbitVisualization">
              {(props) => (
                <OrbitVisualizationScreen
                  {...props}
                  onComplete={() => props.navigation.navigate('EventDiscovery')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="EventDiscovery">
              {(props) => (
                <EventDiscoveryScreen
                  {...props}
                  onEventPress={() => {
                    // EventDiscoveryScreen will handle navigation internally with the event data
                  }}
                  onJoinPress={() => {
                    // EventDiscoveryScreen will handle navigation internally with the event data
                  }}
                  onNotYourEvent={() => props.navigation.navigate('Search')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="EventDetail">
              {(props) => (
                <EventDetailScreen
                  {...props}
                  onBackPress={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="UserProfile">
              {(props) => (
                <UserProfileScreen
                  {...props}
                  onEventPress={() => props.navigation.navigate('EventDetail')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Search">
              {(props) => (
                <SearchScreen
                  {...props}
                  onEventPress={(event) => props.navigation.navigate('EventDetail', { event })}
                />
              )}
            </Stack.Screen>

            {/* Host Flow */}
            <Stack.Screen name="HostDashboard" component={HostDashboardScreen} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
            <Stack.Screen name="EventCheckins" component={EventCheckinsScreen} />

            {/* Recruiter Flow */}
            <Stack.Screen name="RecruiterDashboard" component={RecruiterDashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}

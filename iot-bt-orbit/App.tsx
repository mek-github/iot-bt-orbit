import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

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

export type RootStackParamList = {
  RoleSelection: undefined;
  Login: { role: 'attendee' | 'host' };
  LoadingSplash: undefined;
  ProgressiveLoading: { stage: 1 | 2 | 3 | 4 };
  OrbitVisualization: undefined;
  EventDiscovery: undefined;
  EventDetail: { eventId?: string };
  UserProfile: undefined;
  Search: undefined;
  HostDashboard: undefined;
  EventCheckins: { eventId: string; event: any };
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
                  userName="Farah"
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
                    userName="Farah"
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
                  userName="Farah"
                  onComplete={() => props.navigation.navigate('EventDiscovery')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="EventDiscovery">
              {(props) => (
                <EventDiscoveryScreen
                  {...props}
                  onEventPress={() => props.navigation.navigate('EventDetail')}
                  onJoinPress={() => props.navigation.navigate('EventDetail')}
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
                  onEventPress={() => props.navigation.navigate('EventDetail')}
                />
              )}
            </Stack.Screen>

            {/* Host Flow */}
            <Stack.Screen name="HostDashboard" component={HostDashboardScreen} />
            <Stack.Screen name="EventCheckins" component={EventCheckinsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}

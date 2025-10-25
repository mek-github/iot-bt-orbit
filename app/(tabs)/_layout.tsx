import { Tabs } from 'expo-router';
import React from 'react';

// 1. IMPORT YOUR NEW CUSTOM COMPONENT
// (Assuming you create it in 'components/MyCustomTabBar.tsx')
import { TabBar } from '@/components/tabBar';

// You no longer need HapticTab, IconSymbol, Colors, or useColorScheme here.
// Your new component will handle all of that.

export default function TabLayout() {
  // The colorScheme logic is also moved.

  return (
    <Tabs
      // 2. THIS IS THE MAIN CHANGE:
      // Tell <Tabs> to use your component for its UI.
      tabBar={(props) => <TabBar {...props} />}
      
      screenOptions={{
        // 3. Remove all styling options from here.
        // Your new component is in charge of style.
        headerShown: false,
      }}>
      
      {/* 4. Keep the screens, but remove the icon options.
           Your custom component will add icons based on the 'name'.
       */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          // tabBarIcon is removed
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // tabBarIcon is removed
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // tabBarIcon is removed
        }}
      />
    </Tabs>
  );
}
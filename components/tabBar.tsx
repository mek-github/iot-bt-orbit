import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { HapticTab } from '@/components/haptic-tab'; // You can re-use this
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Import the official props type for great TypeScript support
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const tabBg = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  return (
    // This is the main bar container
    <View style={[styles.tabBarContainer, { backgroundColor: tabBg }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isSelected = state.index === index;
        const color = isSelected ? tint : 'gray';

        // Define icon based on route name
        const iconName = route.name === 'index' ? 'house.fill' 
                       : route.name === 'explore' ? 'paperplane.fill' 
                       : 'person.fill'; // for 'profile'

        // --- This is your special "Home" (index) button ---
        if (route.name === 'index') {
          return (
            // Use a View to center the floating button in its "slot"
            <View key={route.key} style={styles.floatingButtonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate(route.name)}
                style={[styles.floatingButton, { backgroundColor: tabBg }]}
              >
                <IconSymbol size={32} name={iconName} color={color} />
              </TouchableOpacity>
            </View>
          );
        }

        // --- This is for all other normal buttons (Explore, Profile) ---
        return (
          <HapticTab
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <IconSymbol size={28} name={iconName} color={color} />
            <Text style={{ color, fontSize: 10, marginTop: 4 }}>
              {options.title}
            </Text>
          </HapticTab>
        );
      })}
    </View>
  );
}

// --- All your styles are now in one place ---
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 90, // Taller bar to make room for the button
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    // add shadow here if you want
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10, // Pushes icon/text down a bit
  },
  floatingButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  floatingButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -30 }], // Lifts the button up
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
});
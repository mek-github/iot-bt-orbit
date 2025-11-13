import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface BottomNavProps {
  theme: 'light' | 'dark';
  activeTab?: 'discover' | 'profile';
  onDiscoverPress?: () => void;
  onProfilePress?: () => void;
  onSearchPress?: () => void;
  showCenterIcon?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  theme,
  activeTab = 'discover',
  onDiscoverPress,
  onProfilePress,
  onSearchPress,
  showCenterIcon = false,
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1A1E2E' : '#F0F0F0';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Left Icon - Discover/Search */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onSearchPress || onDiscoverPress}
        activeOpacity={0.7}
      >
        {theme === 'light' ? (
          <View style={[styles.iconCircle, styles.lightActiveCircle]}>
            <Text style={styles.lightIconText}>🧭</Text>
          </View>
        ) : (
          <Text style={styles.darkIcon}>🔍</Text>
        )}
      </TouchableOpacity>

      {/* Center Icon (only on light theme) */}
      {showCenterIcon && (
        <View style={styles.centerIcon}>
          <View style={styles.centerCircle} />
        </View>
      )}

      {/* Right Icon - Profile */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        {theme === 'light' ? (
          <Text style={styles.lightIconSimple}>👤</Text>
        ) : (
          <Text style={styles.darkIcon}>👤</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    paddingBottom: 20,
    borderTopWidth: 0,
  },
  iconButton: {
    padding: 12,
  },
  // Light theme - left icon with background circle
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightActiveCircle: {
    backgroundColor: '#000000',
  },
  lightIconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  // Light theme - simple icon (no circle)
  lightIconSimple: {
    fontSize: 28,
    color: '#000000',
  },
  // Dark theme icons
  darkIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  // Center icon (light theme only)
  centerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ADADAD',
  },
});
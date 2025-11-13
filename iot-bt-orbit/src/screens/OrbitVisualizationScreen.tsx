import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { BottomNav } from '../components/BottomNav';

const { width, height } = Dimensions.get('window');

interface OrbitVisualizationScreenProps {
  userName?: string;
  onComplete?: () => void;
  navigation?: any;
}

export const OrbitVisualizationScreen: React.FC<OrbitVisualizationScreenProps> = ({
  userName = 'Farah',
  onComplete,
  navigation,
}) => {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Pulse effect
    pulse.value = withRepeat(
      withTiming(1.02, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Auto-transition after 2-3 seconds when orbit detected
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Status Dot Indicator */}
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ORBIT</Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Your connections are aligning — welcome to Orbit, {userName}.
          </Text>
        </View>

        {/* Central Animated Orb */}
        <View style={styles.orbContainer}>
          {/* Background glow */}
          <View style={styles.glowContainer}>
            <View style={styles.orbGlow} />
          </View>
          
          {/* Main orb - make it tappable to skip */}
          <TouchableOpacity 
            style={styles.orb}
            onPress={onComplete}
            activeOpacity={0.9}
          >
            <View style={styles.orbCore} />
          </TouchableOpacity>
          
          {/* Tap hint */}
          <Text style={styles.tapHint}>Tap to continue</Text>
        </View>
      </View>

      {/* Bottom Navigation - 2 icons only */}
      <BottomNav 
        theme="dark" 
        showCenterIcon={false} 
        activeTab="discover"
        onSearchPress={() => navigation?.navigate('Search')}
        onProfilePress={() => navigation?.navigate('UserProfile')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  statusIndicator: {
    alignItems: 'center',
    paddingTop: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4DC4C4',
  },
  header: {
    marginTop: 28,
    alignItems: 'center',
  },
  logo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  welcomeSection: {
    marginTop: 60,
    paddingHorizontal: 28,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'left',
  },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    width: 300,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbGlow: {
    width: 300,
    height: 280,
    borderRadius: 150,
    backgroundColor: '#0D3A3A',
    opacity: 0.6,
  },
  orb: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbCore: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(77, 196, 196, 0.3)',
    borderWidth: 3,
    borderColor: 'rgba(93, 229, 229, 0.4)',
    shadowColor: '#4DC4C4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  tapHint: {
    marginTop: 40,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
});

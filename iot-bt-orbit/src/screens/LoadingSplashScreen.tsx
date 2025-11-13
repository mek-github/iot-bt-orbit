import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { BottomNav } from '../components/BottomNav';

const { width } = Dimensions.get('window');

interface LoadingSplashScreenProps {
  userName?: string;
  onLoadComplete?: () => void;
  navigation?: any;
}

export const LoadingSplashScreen: React.FC<LoadingSplashScreenProps> = ({
  userName = 'Farah',
  onLoadComplete,
  navigation,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer animation for skeleton loading effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation for gray circle
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Auto-transition after 1.5 seconds (per spec)
    const timer = setTimeout(() => {
      onLoadComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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

        {/* Large Card with Shimmer Effect and Rotating Circle */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#C8C8C8', '#E5E5E5']}
            locations={[0.4, 0.6]}
            style={styles.card}
          >
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
            {/* Rotating Gray Circle */}
            <Animated.View
              style={[
                styles.rotatingCircle,
                {
                  transform: [{ rotate: rotation }],
                },
              ]}
            >
              <View style={styles.circleSegment} />
            </Animated.View>
          </LinearGradient>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNav 
        theme="light" 
        showCenterIcon={true} 
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  welcomeSection: {
    marginTop: 80,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: '#000000',
    textAlign: 'left',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 48,
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    width: width,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
  rotatingCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#888888',
    borderStyle: 'solid',
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -110,
  },
  circleSegment: {
    width: 30,
    height: 4,
    backgroundColor: '#888888',
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -15,
  },
});

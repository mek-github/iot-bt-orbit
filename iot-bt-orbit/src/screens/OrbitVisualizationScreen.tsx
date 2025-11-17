import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { BottomNav } from '../components/BottomNav';
import { getCurrentUser, getUserProfile } from '../services/firebaseService';

const { width, height } = Dimensions.get('window');

interface OrbitVisualizationScreenProps {
  userName?: string;
  onComplete?: () => void;
  navigation?: any;
}

export const OrbitVisualizationScreen: React.FC<OrbitVisualizationScreenProps> = ({
  userName: userNameProp,
  onComplete,
  navigation,
}) => {
  const [userName, setUserName] = useState(userNameProp || 'User');
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // Load user name from Firebase
    const loadUserName = async () => {
      const user = getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserName(profile.name);
        }
      }
    };
    loadUserName();

    // Auto-transition after 3 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle tap to skip
  const handleSkip = () => {
    onComplete?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.content} 
        activeOpacity={1}
        onPress={handleSkip}
      >
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
            Your orbits are aligning, {userName}.
          </Text>
        </View>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={require('../../assets/orbit-animation.mp4')}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted
          />
          
          {/* Tap hint */}
          <Text style={styles.tapHint}>Tap anywhere to continue</Text>
        </View>
      </TouchableOpacity>

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
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: 400,
    height: 400,
  },
  tapHint: {
    marginTop: 40,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
});

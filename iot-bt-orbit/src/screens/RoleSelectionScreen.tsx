import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');

interface RoleSelectionScreenProps {
  navigation?: any;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>ORBIT</Text>
          <Text style={styles.subtitle}>Choose your role</Text>
        </View>

        {/* Attendee Card */}
        <TouchableOpacity
          style={styles.cardContainer}
          activeOpacity={0.9}
          onPress={() => navigation?.navigate('Login', { role: 'attendee' })}
        >
          <LinearGradient
            colors={['#2A3544', '#1A2332']}
            style={[styles.card, styles.attendeeCard]}
          >
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>Attendee</Text>
            <Text style={styles.cardDescription}>Discover and join events near you</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recruiter Card */}
        <TouchableOpacity
          style={[styles.cardContainer, styles.recruiterCardContainer]}
          activeOpacity={0.9}
          onPress={() => navigation?.navigate('Login', { role: 'recruiter' })}
        >
          <LinearGradient
            colors={['#2A3544', '#1A2332']}
            style={[styles.card, styles.recruiterCard]}
          >
            <Text style={styles.cardIcon}>💼</Text>
            <Text style={styles.cardTitle}>Recruiter</Text>
            <Text style={styles.cardDescription}>Connect with top talent at events</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Host Card */}
        <TouchableOpacity
          style={[styles.cardContainer, styles.hostCardContainer]}
          activeOpacity={0.9}
          onPress={() => navigation?.navigate('Login', { role: 'host' })}
        >
          <LinearGradient
            colors={['#2A3544', '#1A2332']}
            style={[styles.card, styles.hostCard]}
          >
            <Text style={styles.cardIcon}>📅</Text>
            <Text style={styles.cardTitle}>Host</Text>
            <Text style={styles.cardDescription}>Manage your events and attendees</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    marginTop: '15%',
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: colors.white,
    opacity: 0.7,
  },
  cardContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  recruiterCardContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  hostCardContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  card: {
    width: width - 80,
    height: 160,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeeCard: {
    borderWidth: 2,
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  recruiterCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  hostCard: {
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.6,
    textAlign: 'center',
  },
});

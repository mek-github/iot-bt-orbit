import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { Colors, Spacing, BorderRadius } from '../theme';
import { Icon } from '../components/Icon';
import { Event } from '../utils/eventStorage';
import { logoutUser, subscribeToEvents, getCurrentUser, getUserProfile, updateUserProfile } from '../services/firebaseService';

const { width } = Dimensions.get('window');

interface RecruiterDashboardScreenProps {
  navigation?: any;
}

export const RecruiterDashboardScreen: React.FC<RecruiterDashboardScreenProps> = ({ navigation }) => {
  const [recruiterName, setRecruiterName] = useState('Recruiter');
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Recruiter profile info
  const [company, setCompany] = useState('');
  const [recruitingFor, setRecruitingFor] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  useEffect(() => {
    loadUserData();
    
    // Subscribe to real-time event updates
    const unsubscribe = subscribeToEvents((allEvents) => {
      console.log('RecruiterDashboard: Real-time events update:', allEvents.length);
      setEvents(allEvents);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setRecruiterName(profile.name);
          setCompany(profile.company || '');
          setRecruitingFor(profile.recruitingFor || '');
          setLookingFor(profile.lookingFor || '');
        }
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        await updateUserProfile(user.uid, {
          company,
          recruitingFor,
          lookingFor,
        });
        setIsEditingProfile(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation?.replace('RoleSelection');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.recruiterName}>{recruiterName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Text style={styles.sectionTitle}>Recruiter Profile</Text>
            <TouchableOpacity 
              onPress={() => setIsEditingProfile(!isEditingProfile)}
              style={styles.editButton}
            >
              <Icon 
                name={isEditingProfile ? 'close' : 'create-outline'} 
                size={20} 
                color={colors.cyan} 
              />
            </TouchableOpacity>
          </View>

          {isEditingProfile ? (
            <View style={styles.profileForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="e.g., Google, Microsoft"
                  placeholderTextColor={colors.textGray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recruiting For</Text>
                <TextInput
                  style={styles.input}
                  value={recruitingFor}
                  onChangeText={setRecruitingFor}
                  placeholder="e.g., Software Engineering, Data Science"
                  placeholderTextColor={colors.textGray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Looking For</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={lookingFor}
                  onChangeText={setLookingFor}
                  placeholder="e.g., Entry level, 2+ years experience, specific skills"
                  placeholderTextColor={colors.textGray}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileDisplay}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Company:</Text>
                <Text style={styles.profileValue}>{company || 'Not set'}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Recruiting For:</Text>
                <Text style={styles.profileValue}>{recruitingFor || 'Not set'}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Looking For:</Text>
                <Text style={styles.profileValue}>{lookingFor || 'Not set'}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Events List */}
        <Text style={styles.sectionTitle}>Available Events</Text>

        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation?.navigate('EventDetail', { event })}
            activeOpacity={0.8}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.attendeeBadge}>
                <Icon name="people" size={16} color={colors.cyan} />
                <Text style={styles.attendeeText}>{event.checkedInCount ?? 0}</Text>
              </View>
            </View>

            <View style={styles.eventMeta}>
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>📅</Text>
                <Text style={styles.metaText}>{event.date}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>📍</Text>
                <Text style={styles.metaText}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.viewButtonContainer}>
              <Text style={styles.viewButton}>View Event →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.textGray,
  },
  recruiterName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.cardDark,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: colors.cardDark,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  editButton: {
    padding: 4,
  },
  profileForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  profileDisplay: {
    gap: 12,
  },
  profileItem: {
    gap: 4,
  },
  profileLabel: {
    fontSize: 12,
    color: colors.textGray,
    fontWeight: '600',
  },
  profileValue: {
    fontSize: 14,
    color: colors.white,
  },
  eventCard: {
    backgroundColor: colors.cardDark,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(77, 196, 196, 0.2)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
    marginRight: 12,
  },
  attendeeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 196, 196, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  attendeeText: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
  eventMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textGray,
  },
  viewButtonContainer: {
    alignItems: 'flex-end',
  },
  viewButton: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cyan,
  },
});

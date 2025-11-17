import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components/Icon';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { colors } from '../constants/colors';
import { BottomNav } from '../components/BottomNav';
import { logoutUser, getCurrentUser, getUserProfile, getUserAttendedEvents } from '../services/firebaseService';
import type { UserProfile, Event } from '../services/firebaseService';

const { width } = Dimensions.get('window');

interface EventCardProps {
  title?: string;
  date?: string;
  distance?: string;
  isPlaceholder?: boolean;
  isAddButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  distance,
  isPlaceholder = false,
  isAddButton = false,
}) => {
  if (isAddButton) {
    return (
      <TouchableOpacity style={styles.addCard}>
        <Icon name="add" size={40} color={Colors.dark.secondaryText} />
      </TouchableOpacity>
    );
  }

  if (isPlaceholder) {
    return <View style={styles.placeholderCard} />;
  }

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventImage}>
        <Icon name="business-outline" size={32} color={Colors.dark.secondaryText} />
        <View style={styles.tagsOverlay}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Internships</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Full Time</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Co-Op</Text>
          </View>
        </View>
      </View>
      {title && (
        <View style={styles.eventCardInfo}>
          <Text style={styles.eventCardTitle}>{title}</Text>
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Icon name="calendar-outline" size={12} color={Colors.dark.secondaryText} />
              <Text style={styles.metaItemText}>{date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="location-outline" size={12} color={Colors.dark.secondaryText} />
              <Text style={styles.metaItemText}>{distance}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

interface UserProfileScreenProps {
  onEventPress?: () => void;
  navigation?: any;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  onEventPress,
  navigation,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          
          // Load attended events
          const events = await getUserAttendedEvents(user.uid);
          setAttendedEvents(events);
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              navigation?.replace('RoleSelection');
            } catch (error) {
              console.error('Logout failed', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileHeader}>
          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerPlaceholder}>
              <Icon name="image-outline" size={40} color={Colors.dark.secondaryText} />
            </View>
          </View>

          {/* Profile Info Card */}
          <LinearGradient
            colors={[Colors.dark.profileBlue, Colors.dark.profileBlueDark]}
            style={styles.profileCard}
          >
            {/* Profile Photo */}
            <View style={styles.profilePhotoWrapper}>
              <View style={styles.profilePhoto}>
                <Icon name="person" size={40} color={Colors.dark.secondaryText} />
              </View>
            </View>

            {/* Profile Details */}
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{userProfile?.name || 'Loading...'}</Text>
              <Text style={styles.profileTitle}>
                {userProfile?.email || ''}
              </Text>
              {userProfile?.role === 'recruiter' && (
                <>
                  {userProfile.company && (
                    <Text style={styles.profileLocation}>
                      🏢 {userProfile.company}
                    </Text>
                  )}
                  {userProfile.recruitingFor && (
                    <Text style={styles.profileLocation}>
                      💼 Recruiting for: {userProfile.recruitingFor}
                    </Text>
                  )}
                  {userProfile.lookingFor && (
                    <Text style={styles.profileLocation}>
                      🔍 Looking for: {userProfile.lookingFor}
                    </Text>
                  )}
                </>
              )}
              <View style={styles.statsBadge}>
                <Text style={styles.statsBadgeText}>
                  {attendedEvents.length} Orbit{attendedEvents.length !== 1 ? 's' : ''} Attended
                </Text>
              </View>
              
              {/* Logout Button */}
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Icon name="log-out-outline" size={18} color={Colors.dark.primaryText} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Past Orbits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orbits ({attendedEvents.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {attendedEvents.length > 0 ? (
              attendedEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => navigation?.navigate('EventDetail', { event })}
                  activeOpacity={0.8}
                >
                  <EventCard
                    title={event.title}
                    date={event.date}
                    distance={event.location}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <>
                <EventCard isPlaceholder />
                <View style={{paddingHorizontal: 8}}>
                  <Text style={styles.emptyText}>Check in to events to see them here!</Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>

        {/* Role Badge */}
        <View style={styles.section}>
          <View style={styles.roleBadgeContainer}>
            <Text style={styles.roleBadgeLabel}>Account Type:</Text>
            <View style={styles.roleBadgePill}>
              <Text style={styles.roleBadgeText}>
                {userProfile?.role === 'host' ? '🎯 Host' : userProfile?.role === 'recruiter' ? '💼 Recruiter' : '👤 Attendee'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav 
        theme="dark" 
        activeTab="profile"
        onSearchPress={() => navigation?.navigate('Search')}
        onProfilePress={() => navigation?.navigate('EventDiscovery')}
      />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    marginBottom: Spacing.xxxl,
  },
  banner: {
    height: 120,
    backgroundColor: Colors.dark.card,
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A3444',
  },
  profileCard: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: -40,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    paddingTop: 50,
    alignItems: 'center',
  },
  profilePhotoWrapper: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.dark.card,
    borderWidth: 4,
    borderColor: Colors.dark.profileBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.primaryText,
    marginBottom: 6,
  },
  profileTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: Spacing.md,
  },
  profileLocation: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.sm,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.primaryText,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.lg,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.primaryText,
  },
  section: {
    marginBottom: Spacing.xxxl,
    paddingLeft: Spacing.screenPadding,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.dark.primaryText,
    marginBottom: Spacing.lg,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  eventCard: {
    width: 150,
    marginRight: Spacing.md,
  },
  eventImage: {
    height: 190,
    backgroundColor: '#2A3444',
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tagsOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: Colors.dark.primaryText,
    fontWeight: '500',
  },
  eventCardInfo: {
    marginTop: Spacing.sm,
  },
  eventCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.primaryText,
    marginBottom: 4,
  },
  eventMeta: {
    gap: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontSize: 12,
    color: Colors.dark.secondaryText,
  },
  placeholderCard: {
    width: 150,
    height: 190,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.medium,
    marginRight: Spacing.md,
  },
  addCard: {
    width: 150,
    height: 190,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.dark.secondaryText,
    fontStyle: 'italic',
    marginTop: 60,
  },
  roleBadgeContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  roleBadgeLabel: {
    fontSize: 14,
    color: Colors.dark.secondaryText,
    marginBottom: 8,
  },
  roleBadgePill: {
    backgroundColor: 'rgba(77, 196, 196, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(77, 196, 196, 0.5)',
  },
  roleBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.cyan,
  },
});

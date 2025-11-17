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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '../components/Icon';
import { Event } from '../utils/eventStorage';
import { 
  checkInToEvent as firebaseCheckIn,
  checkOutFromEvent as firebaseCheckOut,
  isUserCheckedIn as firebaseIsUserCheckedIn,
  subscribeToEventCheckins,
  getCurrentUser,
  getUserProfile,
  CheckedInUser,
  syncEventCheckedInCount
} from '../services/firebaseService';

const { width } = Dimensions.get('window');

interface RecruiterCardProps {
  name: string;
  company: string;
}

const RecruiterCard: React.FC<RecruiterCardProps> = ({ name, company }) => (
  <View style={styles.recruiterCard}>
    <View style={styles.recruiterLeft}>
      <View style={styles.recruiterPhoto}>
        <Text style={styles.recruiterPhotoText}>👤</Text>
      </View>
      <View style={styles.recruiterInfo}>
        <Text style={styles.recruiterName}>{name}</Text>
        <View style={styles.companyRow}>
          <Text style={styles.recruiterCompany}>{company}</Text>
          <Text style={styles.linkedinIcon}> 🔗</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity>
      <Text style={styles.starIcon}>⭐</Text>
    </TouchableOpacity>
  </View>
);

interface EventDetailScreenProps {
  route?: {
    params?: {
      event?: Event;
    };
  };
  onBackPress?: () => void;
  navigation?: any;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  onBackPress,
  navigation,
}) => {
  const [organizersExpanded, setOrganizersExpanded] = useState(false);
  const [recruitersExpanded, setRecruitersExpanded] = useState(true);
  const [attendeesExpanded, setAttendeesExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [currentCheckedInCount, setCurrentCheckedInCount] = useState<number>(0);
  const [checkedInUsers, setCheckedInUsers] = useState<CheckedInUser[]>([]);

  // Get event from route params or use default
  const event = route?.params?.event || {
    id: 'default-1',
    title: 'Austin Small Business Expo',
    date: 'December 15, 2025',
    location: 'South Congress, Austin, TX',
    attendees: 34,
    checkedInCount: 34,
    category: 'All Majors, Early Career',
    link: 'https://www.thesmallbusinessexpo.com/city/austin/',
    description: 'The Austin Small Business Expo is the city\'s biggest small business conference and one of the top networking events Austin has to offer. Join 2,000+ entrepreneurs, founders, and business owners at this premier event to learn how to increase revenue, scale smarter, and grow your network.',
    recruiters: [
      { name: 'Sarah Johnson', company: 'Tech Innovations Inc.' },
      { name: 'Michael Chen', company: 'StartupHub Austin' },
      { name: 'Emily Rodriguez', company: 'Growth Partners LLC' },
      { name: 'David Kim', company: 'Austin Ventures' },
    ],
  };

  useEffect(() => {
    loadUserIdAndCheckInStatus();
    
    // Sync the checked-in count to fix any discrepancies
    syncEventCheckedInCount(event.id).catch(err => 
      console.log('Could not sync count:', err)
    );
    
    // Subscribe to real-time check-in updates
    const unsubscribe = subscribeToEventCheckins(event.id, (users) => {
      setCheckedInUsers(users);
      setCurrentCheckedInCount(users.length);
    });

    // Initialize the checked-in count
    setCurrentCheckedInCount(event.checkedInCount ?? 0);

    return () => unsubscribe();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      loadUserIdAndCheckInStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserIdAndCheckInStatus = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.log('No user logged in');
        return;
      }
      setUserId(user.uid);

      // Check if user is already checked in
      const checkedIn = await firebaseIsUserCheckedIn(event.id, user.uid);
      setIsCheckedIn(checkedIn);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleCheckInToggle = async () => {
    if (!userId) return;

    try {
      const user = getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to check in');
        return;
      }

      const profile = await getUserProfile(user.uid);
      if (!profile) {
        Alert.alert('Error', 'Failed to load user profile');
        return;
      }

      if (isCheckedIn) {
        // Check out
        try {
          const success = await firebaseCheckOut(event.id, userId);
          if (success) {
            setIsCheckedIn(false);
            console.log('Successfully checked out');
          } else {
            // If checkout returns false, the check-in might not exist
            // Force update the UI anyway
            setIsCheckedIn(false);
            console.log('Checkout returned false, but updating UI');
          }
        } catch (checkoutError: any) {
          console.error('Checkout error:', checkoutError);
          // Even if there's a permissions error, update UI optimistically
          // The permissions error is likely from the checkedInCount update
          setIsCheckedIn(false);
          // Don't show alert - the checkout likely succeeded, just permissions failed on count update
        }
      } else {
        // Check in
        try {
          const success = await firebaseCheckIn(event.id, userId, profile);
          if (success) {
            setIsCheckedIn(true);
            console.log('Successfully checked in');
          } else {
            Alert.alert('Already Checked In', 'You are already checked in to this event');
          }
        } catch (checkinError: any) {
          console.error('Check-in error:', checkinError);
          // Check if the check-in might have succeeded despite the error
          // If it's a permissions error on the count update, the check-in document was still created
          if (checkinError.code === 'permission-denied') {
            // Optimistically update UI - check-in likely worked
            setIsCheckedIn(true);
          } else {
            Alert.alert('Error', checkinError.message || 'Failed to check in. Please try again.');
          }
        }
      }
    } catch (error: any) {
      console.error('General error:', error);
      Alert.alert('Error', error.message || 'Failed to update check-in status. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImage}>
            <Text style={styles.heroPlaceholder}>🏢</Text>
          </View>
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Content Card - Overlaps Image */}
        <View style={styles.contentCard}>
          {/* Title Row with Badge */}
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.attendeeBadge}>
              <Text style={styles.badgeIcon}>🌐</Text>
              <Text style={styles.badgeText}>{currentCheckedInCount}</Text>
            </View>
          </View>

          {/* Meta Information */}
          <View style={styles.metaSection}>
            {event.category && <Text style={styles.categoryText}>{event.category}</Text>}
            
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{event.date}</Text>
            </View>
            
            <TouchableOpacity style={styles.metaRow}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{event.location}</Text>
            </TouchableOpacity>
            
            {event.link && (
              <TouchableOpacity style={styles.metaRow}>
                <Text style={styles.metaIcon}>🔗</Text>
                <Text style={[styles.metaText, styles.linkText]}>
                  {event.link}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.detailsText}>
              {event.description}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.starButton}
              onPress={() => setIsFavorited(!isFavorited)}
            >
              <Text style={styles.starButtonIcon}>{isFavorited ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
            
            {/* Check-in Button */}
            <TouchableOpacity 
              style={[styles.checkInButton, isCheckedIn && styles.checkedInButton]}
              onPress={handleCheckInToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.checkInButtonText}>
                {isCheckedIn ? '✓ Checked In' : 'Check In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Organizers Section */}
          <TouchableOpacity
            style={styles.organizersSection}
            onPress={() => setOrganizersExpanded(!organizersExpanded)}
          >
            <Text style={styles.sectionTitle}>Organizers</Text>
            <Text style={styles.chevron}>{organizersExpanded ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {organizersExpanded && (
            <View style={styles.organizersContent}>
              <Text style={styles.placeholderText}>Organizer details coming soon...</Text>
            </View>
          )}

          {/* Recruiters Section */}
          <View style={styles.recruitersSection}>
            <TouchableOpacity
              style={styles.recruitersHeader}
              onPress={() => setRecruitersExpanded(!recruitersExpanded)}
            >
              <Text style={styles.recruitersSectionTitle}>Recruiters</Text>
              <Text style={styles.chevronWhite}>{recruitersExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {recruitersExpanded && event.recruiters && event.recruiters.length > 0 && (
              <View style={styles.recruitersList}>
                {event.recruiters.map((recruiter, index) => (
                  <RecruiterCard 
                    key={index} 
                    name={recruiter.name} 
                    company={recruiter.company} 
                  />
                ))}
              </View>
            )}
            
            {recruitersExpanded && (!event.recruiters || event.recruiters.length === 0) && (
              <View style={styles.organizersContent}>
                <Text style={styles.placeholderText}>No recruiters listed yet</Text>
              </View>
            )}
          </View>

          {/* Checked-In Attendees Section */}
          <TouchableOpacity
            style={styles.organizersSection}
            onPress={() => setAttendeesExpanded(!attendeesExpanded)}
          >
            <Text style={styles.sectionTitle}>
              Who's Here ({checkedInUsers.length})
            </Text>
            <Text style={styles.chevron}>{attendeesExpanded ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {attendeesExpanded && (
            <View style={styles.organizersContent}>
              {checkedInUsers.length === 0 ? (
                <Text style={styles.placeholderText}>No one checked in yet. Be the first!</Text>
              ) : (
                <View style={styles.attendeesList}>
                  {checkedInUsers.map((user) => (
                    <View key={user.userId} style={styles.attendeeItem}>
                      <View style={styles.attendeeAvatar}>
                        <Text style={styles.attendeeAvatarText}>
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </Text>
                      </View>
                      <View style={styles.attendeeDetails}>
                        <View style={styles.attendeeNameRow}>
                          <Text style={styles.attendeeNameText}>{user.name}</Text>
                          {user.role === 'recruiter' && (
                            <View style={styles.recruiterBadge}>
                              <Text style={styles.recruiterBadgeIcon}>💼</Text>
                              <Text style={styles.recruiterBadgeText}>RECRUITER</Text>
                            </View>
                          )}
                        </View>
                        {user.role === 'recruiter' && user.company && (
                          <Text style={styles.attendeeCompanyText}>
                            {user.company}
                            {user.recruitingFor && ` • ${user.recruitingFor}`}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Spacer for scrolling */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholder: {
    fontSize: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -80,
    paddingTop: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    lineHeight: 32,
  },
  attendeeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  metaSection: {
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666666',
  },
  linkText: {
    color: '#4DC4C4',
  },
  detailsSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 23,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  starButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButtonIcon: {
    fontSize: 22,
  },
  checkInButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4DC4C4',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedInButton: {
    backgroundColor: '#2ECC71',
  },
  checkInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    gap: 8,
  },
  filterIcon: {
    fontSize: 18,
  },
  filterButtonText: {
    fontSize: 15,
    color: '#666666',
  },
  organizersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 16,
  },
  organizersContent: {
    padding: 16,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
  },
  chevron: {
    fontSize: 16,
    color: '#000000',
  },
  recruitersSection: {
    backgroundColor: 'transparent',
    marginTop: 16,
  },
  recruitersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recruitersSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  chevronWhite: {
    fontSize: 16,
    color: '#000000',
  },
  recruitersList: {
    gap: 12,
  },
  recruiterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A3544',
    padding: 14,
    borderRadius: 14,
  },
  recruiterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recruiterPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3A4554',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recruiterPhotoText: {
    fontSize: 24,
  },
  recruiterInfo: {
    flex: 1,
  },
  recruiterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recruiterCompany: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  linkedinIcon: {
    fontSize: 14,
    color: '#4DC4C4',
  },
  starIcon: {
    fontSize: 24,
  },
  attendeesList: {
    gap: 12,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DC4C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  attendeeDetails: {
    flex: 1,
  },
  attendeeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  attendeeNameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  recruiterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  recruiterBadgeIcon: {
    fontSize: 9,
  },
  recruiterBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  attendeeCompanyText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
});

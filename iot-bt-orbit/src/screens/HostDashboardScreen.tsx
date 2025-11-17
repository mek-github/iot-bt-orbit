import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { Event } from '../utils/eventStorage';
import { logoutUser, subscribeToEvents, getCurrentUser, getUserProfile, syncEventCheckedInCount } from '../services/firebaseService';

const { width } = Dimensions.get('window');

interface HostDashboardScreenProps {
  navigation?: any;
}

export const HostDashboardScreen: React.FC<HostDashboardScreenProps> = ({ navigation }) => {
  const [hostName, setHostName] = useState('Host');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadUserData();
    
    // Subscribe to real-time event updates
    const unsubscribe = subscribeToEvents((allEvents) => {
      console.log('HostDashboard: Real-time events update:', allEvents.length);
      
      // Sync checked-in counts for all events to fix any discrepancies
      allEvents.forEach(event => {
        syncEventCheckedInCount(event.id).catch(err => 
          console.log('Could not sync count for event', event.id, err)
        );
      });
      
      setEvents(allEvents);
    });

    return () => unsubscribe();
  }, []);

  // Reload events when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      // Events auto-update via real-time listener
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
          setHostName(profile.name);
        }
      }
    } catch (error) {
      console.error('Failed to load user data', error);
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
          <Text style={styles.hostName}>{hostName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Create Event Button */}
      <View style={styles.createEventSection}>
        <TouchableOpacity 
          style={styles.createEventButton}
          onPress={() => navigation?.navigate('CreateEvent')}
          activeOpacity={0.8}
        >
          <Text style={styles.createEventIcon}>+</Text>
          <Text style={styles.createEventText}>Create New Event</Text>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Events</Text>

        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation?.navigate('EventCheckins', { eventId: event.id, event })}
            activeOpacity={0.8}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
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

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{event.checkedInCount ?? 0}</Text>
                <Text style={styles.statLabel}>Checked In</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{event.capacity || 'N/A'}</Text>
                <Text style={styles.statLabel}>Capacity</Text>
              </View>
            </View>

            <View style={styles.viewButtonContainer}>
              <Text style={styles.viewButton}>View Attendees →</Text>
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
  hostName: {
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
  createEventSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  createEventButton: {
    backgroundColor: colors.cyan,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createEventIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.white,
    lineHeight: 28,
  },
  createEventText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    paddingHorizontal: 24,
    marginBottom: 16,
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
  statusBadge: {
    backgroundColor: colors.cyan,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
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
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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

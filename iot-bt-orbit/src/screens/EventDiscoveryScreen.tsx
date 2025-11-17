import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Icon } from '../components/Icon';
import { BottomNav } from '../components/BottomNav';
import { subscribeToEvents } from '../services/firebaseService';
import type { Event } from '../services/firebaseService';

const { width } = Dimensions.get('window');

interface EventDiscoveryScreenProps {
  onEventPress?: () => void;
  onJoinPress?: () => void;
  onNotYourEvent?: () => void;
  navigation?: any;
}

export const EventDiscoveryScreen: React.FC<EventDiscoveryScreenProps> = ({
  onEventPress,
  onJoinPress,
  onNotYourEvent,
  navigation,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((loadedEvents) => {
      setEvents(loadedEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const currentEvent = events[currentEventIndex];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4DC4C4" />
          <Text style={styles.notYourEventText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (events.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>ORBIT</Text>
          </View>
          <View style={[styles.titleSection, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.title}>No events found near you</Text>
            <TouchableOpacity 
              style={[styles.joinButton, { marginTop: 20 }]}
              onPress={onNotYourEvent}
              activeOpacity={0.8}
            >
              <Text style={styles.joinButtonText}>Browse All Events</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BottomNav 
          theme="dark" 
          showCenterIcon={false}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Status Dot */}
      <View style={styles.statusIndicator}>
        <View style={styles.statusDot} />
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ORBIT</Text>
        </View>

        {/* Section Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Orbits found near you:</Text>
        </View>

        {/* Event Card */}
        <TouchableOpacity
          style={styles.eventCard}
          onPress={onEventPress}
          activeOpacity={0.9}
        >
          {/* Event Image */}
          <View style={styles.imageContainer}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🏢</Text>
            </View>
          </View>

          {/* Event Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.eventTitle}>{currentEvent.title}</Text>
            <Text style={styles.eventDate}>{currentEvent.date}</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>�</Text>
                <Text style={styles.statText}>{currentEvent.location}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👥</Text>
                <Text style={styles.statText}>{currentEvent.checkedInCount || 0}</Text>
              </View>

              {/* Join Button */}
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => {
                  if (onEventPress) {
                    onEventPress();
                  } else {
                    navigation?.navigate('EventDetail', { event: currentEvent });
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.joinButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* Not Your Event Link */}
        <TouchableOpacity 
          style={styles.notYourEventContainer}
          onPress={() => {
            if (currentEventIndex < events.length - 1) {
              setCurrentEventIndex(currentEventIndex + 1);
            } else if (onNotYourEvent) {
              onNotYourEvent();
            } else {
              navigation?.navigate('Search');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.notYourEventText}>
            {currentEventIndex < events.length - 1 ? 'Show next event' : 'Browse all events'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  titleSection: {
    marginTop: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: 280,
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  placeholderText: {
    fontSize: 80,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4DC4C4',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4DC4C4',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 18,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  joinButton: {
    backgroundColor: '#4DC4C4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: '#4DC4C4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  notYourEventContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
  notYourEventText: {
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

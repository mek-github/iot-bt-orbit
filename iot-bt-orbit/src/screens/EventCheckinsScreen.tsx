import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../constants/colors';
import { subscribeToEventCheckins } from '../services/firebaseService';
import type { CheckedInUser } from '../utils/eventStorage';

interface Attendee {
  id: string;
  name: string;
  email: string;
  checkedInAt: string;
  status: 'checked-in' | 'registered';
  role?: 'attendee' | 'host' | 'recruiter';
  company?: string;
  recruitingFor?: string;
  lookingFor?: string;
}

interface EventCheckinsScreenProps {
  navigation?: any;
  route?: {
    params: {
      eventId: string;
      event: {
        title: string;
        date: string;
        location: string;
      };
    };
  };
}

export const EventCheckinsScreen: React.FC<EventCheckinsScreenProps> = ({
  navigation,
  route,
}) => {
  const event = route?.params?.event;
  const eventId = route?.params?.eventId;
  const [attendees, setAttendees] = useState<CheckedInUser[]>([]);

  useEffect(() => {
    if (!eventId) return;

    // Subscribe to real-time check-in updates
    const unsubscribe = subscribeToEventCheckins(eventId, (users) => {
      setAttendees(users);
    });

    return () => unsubscribe();
  }, [eventId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Check-Ins</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Event Info */}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event?.title}</Text>
        <View style={styles.eventMetaRow}>
          <Text style={styles.eventMetaIcon}>📅</Text>
          <Text style={styles.eventMetaText}>{event?.date}</Text>
        </View>
        <View style={styles.eventMetaRow}>
          <Text style={styles.eventMetaIcon}>📍</Text>
          <Text style={styles.eventMetaText}>{event?.location}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{attendees.length}</Text>
          <Text style={styles.statLabel}>Total Check-Ins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {attendees.filter((a) => a.role === 'recruiter').length}
          </Text>
          <Text style={styles.statLabel}>Recruiters</Text>
        </View>
      </View>

      {/* Attendees List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Checked In Attendees</Text>
        <Text style={styles.listCount}>{attendees.length} people</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {attendees.map((attendee, index) => (
          <View key={attendee.userId} style={styles.attendeeCard}>
            <View style={styles.attendeeAvatar}>
              <Text style={styles.avatarText}>
                {attendee.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.attendeeInfo}>
              <Text style={styles.attendeeName}>{attendee.name}</Text>
              {attendee.role === 'recruiter' && (
                <View style={styles.recruiterTag}>
                  <Text style={styles.recruiterTagIcon}>💼</Text>
                  <Text style={styles.recruiterTagText}>RECRUITER</Text>
                </View>
              )}
              {attendee.role === 'recruiter' && attendee.company && (
                <Text style={styles.attendeeCompany}>
                  {attendee.company}
                  {attendee.recruitingFor && ` • ${attendee.recruitingFor}`}
                </Text>
              )}
            </View>
            <View style={styles.checkInInfo}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Checked In</Text>
              </View>
            </View>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  eventInfo: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.cardDark,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventMetaIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  eventMetaText: {
    fontSize: 14,
    color: colors.textGray,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardDark,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textGray,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  listCount: {
    fontSize: 14,
    color: colors.textGray,
  },
  scrollView: {
    flex: 1,
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  attendeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  recruiterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    gap: 4,
    marginBottom: 4,
  },
  recruiterTagIcon: {
    fontSize: 10,
  },
  recruiterTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  attendeeEmail: {
    fontSize: 13,
    color: colors.textGray,
  },
  attendeeCompany: {
    fontSize: 13,
    color: colors.textGray,
    marginTop: 2,
  },
  checkInInfo: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 196, 196, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyan,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cyan,
  },
  checkInTime: {
    fontSize: 12,
    color: colors.textGray,
  },
});

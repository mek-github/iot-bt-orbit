import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components/Icon';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { colors } from '../constants/colors';
import { BottomNav } from '../components/BottomNav';

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
              <Text style={styles.profileName}>Lotta Schwedhelm</Text>
              <Text style={styles.profileTitle}>
                Computer Science @ The University of Texas at Austin
              </Text>
              <Text style={styles.profileLocation}>
                Austin, Texas, United States
              </Text>
              <View style={styles.statsBadge}>
                <Text style={styles.statsBadgeText}>10 Orbits Attended</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Past Orbits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orbits</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <EventCard
              title="Austin Small Business Expo"
              date="Dec 15"
              distance="0.9 mi"
            />
            <EventCard isPlaceholder />
            <EventCard isPlaceholder />
            <EventCard isAddButton />
          </ScrollView>
        </View>

        {/* Saved Orbits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Orbits</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <EventCard isPlaceholder />
            <EventCard isPlaceholder />
            <EventCard isAddButton />
          </ScrollView>
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
});

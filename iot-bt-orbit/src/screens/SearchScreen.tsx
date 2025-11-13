import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components/Icon';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { colors } from '../constants/colors';
import { BottomNav } from '../components/BottomNav';

const { width } = Dimensions.get('window');

interface EventListItemProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

const EventListItem: React.FC<EventListItemProps> = ({
  title,
  date,
  location,
  attendees,
  isFavorite = false,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.9}>
      {/* Event Image */}
      <View style={styles.listItemImage}>
        <Icon name="business-outline" size={36} color={Colors.dark.secondaryText} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <Icon
            name={isFavorite ? 'star' : 'star-outline'}
            size={18}
            color={isFavorite ? '#FFD700' : Colors.dark.primaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Event Info */}
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.listItemMeta}>
          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={14} color={Colors.dark.secondaryText} />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="location-outline" size={14} color={Colors.dark.secondaryText} />
            <Text style={styles.metaText}>{location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="people-outline" size={14} color={Colors.dark.accent} />
            <Text style={[styles.metaText, { color: Colors.dark.accent }]}>{attendees} attending</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface SearchScreenProps {
  onEventPress?: () => void;
  navigation?: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onEventPress, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('Business');
  const [favorites, setFavorites] = useState<Set<number>>(new Set([0]));

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  const events = [
    {
      title: 'Austin Small Business Expo',
      date: 'Dec 15, 2025',
      location: '0.9 mi away',
      attendees: 120,
    },
    {
      title: 'Tech Networking Mixer',
      date: 'Dec 18, 2025',
      location: '1.2 mi away',
      attendees: 85,
    },
    {
      title: 'Startup Founders Meetup',
      date: 'Dec 20, 2025',
      location: '2.1 mi away',
      attendees: 64,
    },
    {
      title: 'Business Development Summit',
      date: 'Dec 22, 2025',
      location: '3.5 mi away',
      attendees: 200,
    },
    {
      title: 'Entrepreneur Coffee Chat',
      date: 'Dec 25, 2025',
      location: '1.8 mi away',
      attendees: 42,
    },
  ];

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color={Colors.dark.secondaryText}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search events..."
            placeholderTextColor={Colors.dark.secondaryText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={20} color={Colors.dark.primaryText} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {events.map((event, index) => (
          <EventListItem
            key={index}
            title={event.title}
            date={event.date}
            location={event.location}
            attendees={event.attendees}
            isFavorite={favorites.has(index)}
            onPress={onEventPress}
            onFavoritePress={() => toggleFavorite(index)}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav 
        theme="dark" 
        activeTab="discover"
        onSearchPress={() => navigation?.navigate('EventDiscovery')}
        onProfilePress={() => navigation?.navigate('UserProfile')}
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
  header: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.primaryText,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark.primaryText,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: Spacing.screenPadding,
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.listCard,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  listItemImage: {
    width: 85,
    height: 85,
    backgroundColor: '#2A3444',
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.primaryText,
    marginBottom: Spacing.sm,
  },
  listItemMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.dark.secondaryText,
  },
});

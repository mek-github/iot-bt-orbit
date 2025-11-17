import React, { useState, useEffect } from 'react';
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
import { Event } from '../utils/eventStorage';
import { subscribeToEvents } from '../services/firebaseService';

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
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress?.();
          }}
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
  onEventPress?: (event: Event) => void;
  navigation?: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onEventPress, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Subscribe to real-time event updates
    const unsubscribe = subscribeToEvents((allEvents) => {
      console.log('SearchScreen: Real-time events update:', allEvents.length);
      setEvents(allEvents);
    });

    return () => unsubscribe();
  }, []);

  // Reload events when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      // Events auto-update via real-time listener
    });

    return unsubscribe;
  }, [navigation]);

  const loadAllEvents = async () => {
    // No longer needed - real-time listener handles this
  };

  const toggleFavorite = (eventId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
    } else {
      newFavorites.add(eventId);
    }
    setFavorites(newFavorites);
  };

  // Filter events based on search query
  const filteredEvents = searchQuery.trim() === '' 
    ? events 
    : events.filter(event => {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.date.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      });

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
        {filteredEvents.map((event, index) => (
          <EventListItem
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            attendees={event.checkedInCount ?? 0}
            isFavorite={favorites.has(event.id)}
            onPress={() => onEventPress?.(event)}
            onFavoritePress={() => toggleFavorite(event.id)}
          />
        ))}
        {filteredEvents.length === 0 && (
          <View style={styles.noResults}>
            <Icon name="search-outline" size={64} color={Colors.dark.secondaryText} />
            <Text style={styles.noResultsText}>No events found</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term</Text>
          </View>
        )}
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
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.primaryText,
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.dark.secondaryText,
    marginTop: 8,
  },
});

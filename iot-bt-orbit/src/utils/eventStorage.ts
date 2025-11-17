import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  category?: string;
  link?: string;
  distance?: string;
  capacity?: number;
  checkedInCount?: number; // Number of attendees who have checked in
  recruiters?: Array<{
    name: string;
    company: string;
  }>;
}

const EVENTS_STORAGE_KEY = '@orbit_events';
const CHECKINS_STORAGE_KEY = '@orbit_checkins'; // Store which users checked into which events
const CHECKIN_COUNTS_KEY = '@orbit_checkin_counts'; // Store check-in counts for all events (including defaults)

// Structure: { eventId: { userId: { name: string, role: string, company?: string, recruitingFor?: string } } }
export interface CheckedInUser {
  userId: string;
  name: string;
  role: 'attendee' | 'host' | 'recruiter';
  company?: string;
  recruitingFor?: string;
  lookingFor?: string;
}

// Default events to show when no custom events exist
export const DEFAULT_EVENTS: Event[] = [
  {
    id: 'default-1',
    title: 'Austin Small Business Expo',
    date: 'December 15, 2025',
    location: 'South Congress, Austin, TX',
    distance: '0.9 mi away',
    attendees: 34,
    capacity: 500,
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
  },
  {
    id: 'default-2',
    title: 'Tech Networking Mixer',
    date: 'December 18, 2025',
    location: 'Downtown Austin',
    distance: '1.2 mi away',
    attendees: 85,
    capacity: 200,
    checkedInCount: 85,
    category: 'Technology, All Levels',
    description: 'Connect with tech professionals and startups in the Austin area. A great opportunity to expand your network and explore career opportunities in the tech industry.',
    recruiters: [
      { name: 'Alex Turner', company: 'CloudTech Solutions' },
      { name: 'Priya Patel', company: 'DataStream Inc.' },
    ],
  },
  {
    id: 'default-3',
    title: 'Startup Founders Meetup',
    date: 'December 20, 2025',
    location: 'East Austin',
    distance: '2.1 mi away',
    attendees: 64,
    capacity: 150,
    checkedInCount: 64,
    category: 'Entrepreneurship',
    description: 'Monthly meetup for startup founders and entrepreneurs. Share experiences, discuss challenges, and build meaningful connections with fellow founders.',
    recruiters: [],
  },
  {
    id: 'default-4',
    title: 'Business Development Summit',
    date: 'December 22, 2025',
    location: 'Austin Convention Center',
    distance: '3.5 mi away',
    attendees: 200,
    capacity: 500,
    checkedInCount: 200,
    category: 'Business, All Majors',
    description: 'Annual summit focused on business development strategies, networking, and professional growth. Features keynote speakers and panel discussions.',
    recruiters: [
      { name: 'Robert Martinez', company: 'Strategic Growth Partners' },
      { name: 'Jennifer Lee', company: 'Business Solutions LLC' },
    ],
  },
  {
    id: 'default-5',
    title: 'Entrepreneur Coffee Chat',
    date: 'December 25, 2025',
    location: 'South Lamar, Austin',
    distance: '1.8 mi away',
    attendees: 42,
    capacity: 100,
    checkedInCount: 42,
    category: 'Casual Networking',
    description: 'Informal coffee meetup for entrepreneurs and business professionals. Great for making connections in a relaxed environment.',
    recruiters: [],
  },
];

export const saveEvents = async (events: Event[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events:', error);
    throw error;
  }
};

export const loadEvents = async (): Promise<Event[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    const checkinCountsJson = await AsyncStorage.getItem(CHECKIN_COUNTS_KEY);
    const checkinCounts: { [eventId: string]: number } = checkinCountsJson ? JSON.parse(checkinCountsJson) : {};
    
    console.log('eventStorage: Loading events from storage...');
    
    let allEvents: Event[] = [];
    
    if (eventsJson) {
      const customEvents = JSON.parse(eventsJson);
      console.log('eventStorage: Found custom events:', customEvents.length);
      allEvents = [...customEvents, ...DEFAULT_EVENTS];
    } else {
      console.log('eventStorage: No custom events, returning defaults only');
      allEvents = DEFAULT_EVENTS;
    }
    
    // Update all events with real-time check-in counts
    allEvents = allEvents.map(event => ({
      ...event,
      checkedInCount: checkinCounts[event.id] ?? event.checkedInCount ?? 0,
    }));
    
    return allEvents;
  } catch (error) {
    console.error('Failed to load events:', error);
    return DEFAULT_EVENTS;
  }
};

export const addEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const events = await loadCustomEvents();
    const newEvent: Event = {
      ...event,
      id: `custom-${Date.now()}`,
      checkedInCount: 0, // Initialize with 0 checked-in attendees
    };
    console.log('eventStorage: Adding new event:', newEvent.title);
    const updatedEvents = [newEvent, ...events];
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    console.log('eventStorage: Event saved. Total custom events:', updatedEvents.length);
    return newEvent;
  } catch (error) {
    console.error('Failed to add event:', error);
    throw error;
  }
};

export const loadCustomEvents = async (): Promise<Event[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Failed to load custom events:', error);
    return [];
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const events = await loadCustomEvents();
    const updatedEvents = events.filter(event => event.id !== eventId);
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};

// Check-in functionality
export const checkInToEvent = async (
  eventId: string,
  userId: string,
  userName: string,
  userRole: 'attendee' | 'host' | 'recruiter',
  company?: string,
  recruitingFor?: string,
  lookingFor?: string
): Promise<boolean> => {
  try {
    // Get current check-ins
    const checkinsJson = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
    const checkins: { [eventId: string]: { [userId: string]: CheckedInUser } } = checkinsJson ? JSON.parse(checkinsJson) : {};
    
    // Check if user already checked in
    if (checkins[eventId]?.[userId]) {
      return false; // Already checked in
    }
    
    // Add user to event check-ins
    if (!checkins[eventId]) {
      checkins[eventId] = {};
    }
    checkins[eventId][userId] = {
      userId,
      name: userName,
      role: userRole,
      company,
      recruitingFor,
      lookingFor,
    };
    
    // Save check-ins
    await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkins));
    
    // Update event's checkedInCount
    await updateEventCheckedInCount(eventId);
    
    return true;
  } catch (error) {
    console.error('Failed to check in:', error);
    throw error;
  }
};

export const checkOutFromEvent = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    const checkinsJson = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
    const checkins: { [eventId: string]: { [userId: string]: CheckedInUser } } = checkinsJson ? JSON.parse(checkinsJson) : {};
    
    if (!checkins[eventId]?.[userId]) {
      return false; // Not checked in
    }
    
    // Remove user from check-ins
    delete checkins[eventId][userId];
    
    await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkins));
    
    // Update event's checkedInCount
    await updateEventCheckedInCount(eventId);
    
    return true;
  } catch (error) {
    console.error('Failed to check out:', error);
    throw error;
  }
};

export const isUserCheckedIn = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    const checkinsJson = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
    const checkins: { [eventId: string]: { [userId: string]: CheckedInUser } } = checkinsJson ? JSON.parse(checkinsJson) : {};
    return checkins[eventId]?.[userId] !== undefined;
  } catch (error) {
    console.error('Failed to check if user is checked in:', error);
    return false;
  }
};

export const getEventCheckedInUsers = async (eventId: string): Promise<CheckedInUser[]> => {
  try {
    const checkinsJson = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
    const checkins: { [eventId: string]: { [userId: string]: CheckedInUser } } = checkinsJson ? JSON.parse(checkinsJson) : {};
    
    if (!checkins[eventId]) {
      return [];
    }
    
    return Object.values(checkins[eventId]);
  } catch (error) {
    console.error('Failed to get checked-in users:', error);
    return [];
  }
};

const updateEventCheckedInCount = async (eventId: string): Promise<void> => {
  try {
    // Get check-ins count
    const checkinsJson = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
    const checkins: { [eventId: string]: { [userId: string]: CheckedInUser } } = checkinsJson ? JSON.parse(checkinsJson) : {};
    const checkedInCount = checkins[eventId] ? Object.keys(checkins[eventId]).length : 0;
    
    // Update the check-in counts storage (for all events, including defaults)
    const countsJson = await AsyncStorage.getItem(CHECKIN_COUNTS_KEY);
    const counts: { [eventId: string]: number } = countsJson ? JSON.parse(countsJson) : {};
    counts[eventId] = checkedInCount;
    await AsyncStorage.setItem(CHECKIN_COUNTS_KEY, JSON.stringify(counts));
    
    // Also update custom events if this is a custom event
    const customEvents = await loadCustomEvents();
    const updatedEvents = customEvents.map(event => 
      event.id === eventId 
        ? { ...event, checkedInCount }
        : event
    );
    
    if (customEvents.some(e => e.id === eventId)) {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    }
  } catch (error) {
    console.error('Failed to update checked-in count:', error);
  }
};


import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';

// ==================== TYPES ====================

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
  checkedInCount: number;
  hostId: string;
  hostName: string;
  createdAt?: Date;
}

export interface CheckedInUser {
  userId: string;
  name: string;
  role: 'attendee' | 'host' | 'recruiter';
  company?: string;
  recruitingFor?: string;
  lookingFor?: string;
  checkedInAt: Date;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: 'attendee' | 'host' | 'recruiter';
  company?: string;
  recruitingFor?: string;
  lookingFor?: string;
  createdAt: Date;
  attendedEventIds?: string[]; // Track which events user has checked into
}

// ==================== AUTHENTICATION ====================

export const signUpUser = async (
  email: string,
  password: string,
  name: string,
  role: 'attendee' | 'host' | 'recruiter',
  additionalInfo?: { company?: string; recruitingFor?: string; lookingFor?: string }
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
      userId: user.uid,
      email: user.email!,
      name,
      role,
      ...additionalInfo,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    return userDoc.data() as UserProfile;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), updates as any);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// ==================== EVENTS ====================

export const createEvent = async (eventData: Omit<Event, 'id' | 'checkedInCount' | 'createdAt'>): Promise<Event> => {
  try {
    const eventRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      checkedInCount: 0,
      createdAt: serverTimestamp(),
    });

    const newEvent: Event = {
      id: eventRef.id,
      ...eventData,
      checkedInCount: 0,
      createdAt: new Date(),
    };

    return newEvent;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    const events: Event[] = [];

    eventsSnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Event);
    });

    return events;
  } catch (error) {
    console.error('Get events error:', error);
    return [];
  }
};

export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (!eventDoc.exists()) {
      return null;
    }

    const data = eventDoc.data();
    return {
      id: eventDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Event;
  } catch (error) {
    console.error('Get event error:', error);
    return null;
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'events', eventId), updates as any);
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
    // Also delete all check-ins for this event
    const checkinsSnapshot = await getDocs(collection(db, 'events', eventId, 'checkins'));
    const deletePromises = checkinsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
};

// ==================== CHECK-INS ====================

export const checkInToEvent = async (
  eventId: string,
  userId: string,
  userProfile: UserProfile
): Promise<boolean> => {
  try {
    const checkInRef = doc(db, 'events', eventId, 'checkins', userId);
    
    // Check if already checked in
    const existingCheckIn = await getDoc(checkInRef);
    if (existingCheckIn.exists()) {
      return false; // Already checked in
    }

    // Build check-in data without undefined fields (Firestore doesn't allow undefined)
    const checkedInUser: any = {
      userId: userProfile.userId,
      name: userProfile.name,
      role: userProfile.role,
      checkedInAt: serverTimestamp(),
    };

    // Only add optional fields if they exist
    if (userProfile.company) checkedInUser.company = userProfile.company;
    if (userProfile.recruitingFor) checkedInUser.recruitingFor = userProfile.recruitingFor;
    if (userProfile.lookingFor) checkedInUser.lookingFor = userProfile.lookingFor;

    // Add check-in
    await setDoc(checkInRef, checkedInUser);

    // Increment event's checkedInCount
    await updateDoc(doc(db, 'events', eventId), {
      checkedInCount: increment(1),
    });

    // Track attended event in user profile
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentAttendedEvents = userDoc.data()?.attendedEventIds || [];
    if (!currentAttendedEvents.includes(eventId)) {
      await updateDoc(userRef, {
        attendedEventIds: [...currentAttendedEvents, eventId],
      });
    }

    return true;
  } catch (error) {
    console.error('Check-in error:', error);
    throw error;
  }
};

export const checkOutFromEvent = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    const checkInRef = doc(db, 'events', eventId, 'checkins', userId);
    
    // Check if user is checked in
    const existingCheckIn = await getDoc(checkInRef);
    if (!existingCheckIn.exists()) {
      return false; // Not checked in
    }

    // Remove check-in
    await deleteDoc(checkInRef);

    // Decrement event's checkedInCount
    await updateDoc(doc(db, 'events', eventId), {
      checkedInCount: increment(-1),
    });

    return true;
  } catch (error) {
    console.error('Check-out error:', error);
    throw error;
  }
};

export const isUserCheckedIn = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    const checkInRef = doc(db, 'events', eventId, 'checkins', userId);
    const checkInDoc = await getDoc(checkInRef);
    return checkInDoc.exists();
  } catch (error) {
    console.error('Check if user checked in error:', error);
    return false;
  }
};

export const getEventCheckedInUsers = async (eventId: string): Promise<CheckedInUser[]> => {
  try {
    const checkinsSnapshot = await getDocs(collection(db, 'events', eventId, 'checkins'));
    const users: CheckedInUser[] = [];

    checkinsSnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        ...data,
        checkedInAt: data.checkedInAt?.toDate() || new Date(),
      } as CheckedInUser);
    });

    return users;
  } catch (error) {
    console.error('Get checked-in users error:', error);
    return [];
  }
};

// ==================== REAL-TIME LISTENERS ====================

export const subscribeToEvents = (callback: (events: Event[]) => void): (() => void) => {
  const unsubscribe = onSnapshot(
    collection(db, 'events'),
    (snapshot) => {
      const events: Event[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Event);
      });
      callback(events);
    },
    (error) => {
      // Silently ignore permission errors during logout
      if (error.code !== 'permission-denied') {
        console.error('Events subscription error:', error);
      }
    }
  );

  return unsubscribe;
};

export const subscribeToEventCheckins = (
  eventId: string,
  callback: (users: CheckedInUser[]) => void
): (() => void) => {
  const unsubscribe = onSnapshot(
    collection(db, 'events', eventId, 'checkins'),
    (snapshot) => {
      const users: CheckedInUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          checkedInAt: data.checkedInAt?.toDate() || new Date(),
        } as CheckedInUser);
      });
      callback(users);
    },
    (error) => {
      console.error('Check-ins subscription error:', error);
    }
  );

  return unsubscribe;
};

export const subscribeToEvent = (
  eventId: string,
  callback: (event: Event | null) => void
): (() => void) => {
  const unsubscribe = onSnapshot(
    doc(db, 'events', eventId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Event);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Event subscription error:', error);
    }
  );

  return unsubscribe;
};

// ==================== USER EVENT HISTORY ====================

export const getUserAttendedEvents = async (userId: string): Promise<Event[]> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile || !userProfile.attendedEventIds || userProfile.attendedEventIds.length === 0) {
      return [];
    }

    const attendedEvents: Event[] = [];
    for (const eventId of userProfile.attendedEventIds) {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const data = eventDoc.data();
        attendedEvents.push({
          id: eventDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Event);
      }
    }

    return attendedEvents;
  } catch (error) {
    console.error('Error getting attended events:', error);
    return [];
  }
};

// Fix checkedInCount by counting actual check-in documents
export const syncEventCheckedInCount = async (eventId: string): Promise<void> => {
  try {
    const checkinsSnapshot = await getDocs(collection(db, 'events', eventId, 'checkins'));
    const actualCount = checkinsSnapshot.size;
    
    await updateDoc(doc(db, 'events', eventId), {
      checkedInCount: actualCount,
    });
    
    console.log(`Synced event ${eventId}: ${actualCount} check-ins`);
  } catch (error) {
    console.error('Error syncing checked-in count:', error);
    throw error;
  }
};

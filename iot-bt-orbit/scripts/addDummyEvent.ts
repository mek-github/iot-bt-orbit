/**
 * Script to add a dummy event to Firebase for testing
 * Run with: npx ts-node scripts/addDummyEvent.ts
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';

const addDummyEvent = async () => {
  const dummyEvent = {
    id: 'dummy-event-001',
    title: 'Austin Tech Networking Mixer',
    date: '12/20/2025',
    location: 'Austin Convention Center',
    attendees: 0,
    description: 'Join us for an evening of networking with Austin\'s top tech companies and startups. Perfect opportunity to meet recruiters, explore job opportunities, and connect with fellow tech enthusiasts.',
    category: 'Networking',
    distance: '2.5 mi',
    capacity: 150,
    checkedInCount: 0,
    hostId: 'system',
    hostName: 'Orbit Team',
    createdAt: new Date(),
  };

  try {
    await setDoc(doc(db, 'events', dummyEvent.id), dummyEvent);
    console.log('✅ Dummy event added successfully!');
    console.log('Event ID:', dummyEvent.id);
    console.log('Title:', dummyEvent.title);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding dummy event:', error);
    process.exit(1);
  }
};

addDummyEvent();

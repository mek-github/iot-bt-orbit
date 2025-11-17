# Prompt for Firebase Gemini Assistant

Copy and paste this entire message into the Gemini chat in your Firebase Console:

---

I'm building a React Native Expo mobile app called "Orbit Mobile App" for career fairs and networking events. I need you to help me set up Firebase for this app with the following requirements:

## App Overview:
- **Platform**: React Native with Expo
- **Purpose**: Career fair networking app with 3 user roles (Attendees, Hosts, Recruiters)
- **Key Features**: User authentication, event creation/management, check-ins, recruiter profiles

## Firebase Services Needed:

### 1. **Firestore Database**
Please set up Firestore with this structure:

**Collection: `users`**
- Document ID: userId (auto-generated)
- Fields:
  - `userId`: string
  - `email`: string
  - `name`: string
  - `role`: string (values: "attendee", "host", or "recruiter")
  - `company`: string (optional, for recruiters)
  - `recruitingFor`: string (optional, for recruiters)
  - `lookingFor`: string (optional, for recruiters)
  - `createdAt`: timestamp

**Collection: `events`**
- Document ID: eventId (auto-generated)
- Fields:
  - `title`: string
  - `date`: string
  - `location`: string
  - `description`: string
  - `category`: string (optional)
  - `link`: string (optional)
  - `distance`: string (optional)
  - `capacity`: number (optional)
  - `attendees`: number
  - `checkedInCount`: number (default: 0)
  - `hostId`: string (reference to user)
  - `hostName`: string
  - `createdAt`: timestamp

**Subcollection: `events/{eventId}/checkins`**
- Document ID: userId (of checked-in user)
- Fields:
  - `userId`: string
  - `name`: string
  - `role`: string (attendee/host/recruiter)
  - `company`: string (optional)
  - `recruitingFor`: string (optional)
  - `lookingFor`: string (optional)
  - `checkedInAt`: timestamp

### 2. **Authentication**
- Enable **Email/Password** authentication
- I want users to create accounts with email and password
- Need proper session management

### 3. **Security Rules**
Set up Firestore security rules so:
- ✅ Any authenticated user can read all events and user profiles
- ✅ Users can only edit their own profile
- ✅ Only hosts can create events
- ✅ Only event hosts can update/delete their own events
- ✅ Users can only check themselves in/out of events
- ✅ Check-ins are read-only except for creating/deleting your own

### 4. **Indexes**
Create any necessary composite indexes for:
- Querying events by date
- Querying events by location
- Querying check-ins by timestamp

### 5. **Configuration**
After setup, please provide me with:
- The exact Firebase configuration object (apiKey, authDomain, projectId, etc.)
- Confirmation that Firestore and Authentication are enabled
- The security rules you've applied
- Any indexes created

## Additional Context:
- This is for development/testing initially (can use test mode for Firestore)
- I'm using Firebase SDK version 10+ with Expo
- I need real-time listeners for events and check-ins
- Multiple users should see updates instantly across devices

## What I Need From You:
1. Enable Firestore Database in test mode (I'll add security rules later)
2. Enable Email/Password authentication
3. Create the Firestore database structure (collections and fields)
4. Set up appropriate security rules
5. Give me my Firebase config object to paste into my code
6. Tell me if there are any additional steps I need to complete manually

Please walk me through each step and let me know when everything is ready!

---

## After Gemini Responds:

Once Gemini provides your Firebase configuration, copy the config object and paste it into:
`/Users/rehan/Documents/GitHub/iot-bt-orbit/iot-bt-orbit/src/config/firebaseConfig.ts`

Replace this section:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With the actual values Gemini gives you.

Then let me know and I'll migrate all your screens to use Firebase! 🚀

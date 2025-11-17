# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "orbit-app")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Register Your App

1. In the Firebase Console, go to Project Settings (gear icon)
2. Under "Your apps", click the **Web** icon (`</>`)
3. Register your app:
   - App nickname: "Orbit Mobile App"
   - Check "Also set up Firebase Hosting" if desired
   - Click "Register app"

## Step 3: Get Your Firebase Config

1. Firebase will show you a `firebaseConfig` object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmn"
};
```

2. **Copy these values** and paste them into:
   `src/config/firebaseConfig.ts`

## Step 4: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose **"Start in test mode"** (for development)
   - You can add security rules later
4. Select a Cloud Firestore location (choose closest to your users)
5. Click "Enable"

## Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider:
   - Toggle "Email/Password" to enabled
   - Click "Save"

## Step 6: Set Up Firestore Security Rules (Optional but Recommended)

Go to Firestore > Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.hostId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'host');
      
      // Check-ins subcollection
      match /checkins/{userId} {
        allow read: if request.auth != null;
        allow create, delete: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Step 7: Test Your Setup

After updating `firebaseConfig.ts` with your credentials:

1. Run your app: `npm start`
2. Try creating an account (it should create a user in Firebase Auth)
3. Check Firebase Console > Authentication to see the new user
4. Check Firestore Database to see the user profile document

## Firestore Database Structure

Your app will create this structure:

```
📦 Firestore
├── 📁 users/
│   └── 📄 {userId}
│       ├── userId: string
│       ├── email: string
│       ├── name: string
│       ├── role: 'attendee' | 'host' | 'recruiter'
│       ├── company?: string (for recruiters)
│       ├── recruitingFor?: string (for recruiters)
│       ├── lookingFor?: string (for recruiters)
│       └── createdAt: timestamp
│
└── 📁 events/
    └── 📄 {eventId}
        ├── id: string
        ├── title: string
        ├── date: string
        ├── location: string
        ├── description: string
        ├── hostId: string
        ├── hostName: string
        ├── checkedInCount: number
        ├── createdAt: timestamp
        │
        └── 📁 checkins/ (subcollection)
            └── 📄 {userId}
                ├── userId: string
                ├── name: string
                ├── role: 'attendee' | 'host' | 'recruiter'
                ├── company?: string
                ├── recruitingFor?: string
                ├── lookingFor?: string
                └── checkedInAt: timestamp
```

## What This Gives You

✅ **Real authentication** - Users have actual accounts
✅ **Cloud storage** - Data syncs across all devices
✅ **Real-time updates** - Changes appear instantly for all users
✅ **Automatic backups** - Firebase handles data persistence
✅ **Scalability** - Works for 1 user or 1 million users
✅ **Security** - Fine-grained access control with Firestore rules

## Next Steps

After setting up Firebase:
1. Update `firebaseConfig.ts` with your credentials
2. I'll update all screens to use Firebase instead of AsyncStorage
3. Test authentication, event creation, and check-ins
4. Everything will be stored in the cloud! 🎉

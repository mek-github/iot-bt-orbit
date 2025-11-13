# ORBIT iOS App - Complete React Native Implementation

A beautifully designed networking/events app focused on Bluetooth/IoT connectivity for discovering and connecting people at events.

## 🎨 Design Features

- **Complete Figma implementation** with pixel-perfect accuracy
- **Dark/Light theme support** throughout the app
- **9 fully functional screens**:
  1. Loading/Splash Screen
  2-4. Progressive Loading States
  5. Animated Orbit Visualization (signature feature)
  6. Event Discovery
  7. Event Detail Page
  8. User Profile
  9. Search/Browse Events

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Xcode) or physical iOS device
- Expo Go app (for testing on physical device)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd iot-bt-orbit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally (if not already installed):**
   ```bash
   npm install -g expo-cli
   ```

### Running the App

#### On iOS Simulator:
```bash
npm run ios
```

#### On Physical iOS Device:
```bash
npm start
```
Then scan the QR code with the Expo Go app on your iPhone.

#### Development Mode:
```bash
npm start
```
This opens the Expo Developer Tools in your browser.

## 📱 App Structure

```
iot-bt-orbit/
├── App.tsx                      # Main app entry with navigation
├── src/
│   ├── screens/
│   │   ├── LoadingSplashScreen.tsx         # Screen 1: Initial loading
│   │   ├── ProgressiveLoadingScreen.tsx    # Screens 2-4: Loading states
│   │   ├── OrbitVisualizationScreen.tsx    # Screen 5: Animated orb
│   │   ├── EventDiscoveryScreen.tsx        # Screen 6: Events list
│   │   ├── EventDetailScreen.tsx           # Screen 7: Event details
│   │   ├── UserProfileScreen.tsx           # Screen 8: User profile
│   │   └── SearchScreen.tsx                # Screen 9: Search/browse
│   ├── components/
│   │   ├── BottomNav.tsx        # Reusable bottom navigation
│   │   └── SkeletonCard.tsx     # Loading skeleton component
│   └── theme/
│       └── index.ts             # Design system (colors, typography, spacing)
├── package.json
├── app.json
└── tsconfig.json
```

## 🎯 Key Features

### 1. **Animated Orbit Visualization**
The signature feature - a mesmerizing, animated glowing orb using React Native Skia:
- Flowing cyan/turquoise lines
- Ethereal, organic movement
- Represents connections forming via Bluetooth
- Smooth, continuous animations

### 2. **Complete Navigation Flow**
- Automatic progression through loading states
- Smooth screen transitions
- Bottom tab navigation
- Stack navigation for detail views

### 3. **Design System**
- Consistent color palette (light/dark themes)
- Typography system with defined weights and sizes
- Spacing constants for uniform layouts
- Border radius and shadow presets

### 4. **Interactive Components**
- Event cards with join buttons
- Favorite/star functionality
- Expandable sections
- Horizontal scrolling lists
- Search with filters

## 🎨 Color Palette

### Light Theme
- Background: `#FFFFFF`
- Primary Text: `#000000`
- Secondary Text: `#666666`
- Accent: `#4DC4C4` (Cyan/Turquoise)

### Dark Theme
- Background: `#0A0F1C`, `#0D1425`
- Card: `#1A2332`, `#1E2738`
- Primary Text: `#FFFFFF`
- Accent: `#4DC4C4` (Cyan/Turquoise with glow)

## 📦 Dependencies

- **React Navigation**: Screen navigation
- **React Native Reanimated**: Advanced animations
- **React Native Skia**: Canvas graphics for orb visualization
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Vector Icons**: Icon library

## 🔧 Customization

### Changing User Name
Edit the `userName` prop in `App.tsx`:
```typescript
<LoadingSplashScreen userName="YourName" />
```

### Modifying Colors
Edit `src/theme/index.ts` to adjust the color palette.

### Adding Events
Add event data to the `events` array in:
- `SearchScreen.tsx`
- `EventDiscoveryScreen.tsx`

## 📱 Screen Flow

1. **LoadingSplash** → Auto-advances after 3s
2. **ProgressiveLoading (Stage 2)** → Shows 2 skeleton cards
3. **ProgressiveLoading (Stage 3)** → Shows 3 skeleton cards
4. **ProgressiveLoading (Stage 4)** → Shows split card
5. **OrbitVisualization** → Animated orb, advances after 4s
6. **EventDiscovery** → Main events screen with bottom nav
7. **EventDetail** → Tap any event to see details
8. **UserProfile** → Tap profile icon in bottom nav
9. **Search** → Tap search icon in bottom nav

## 🎭 Animations

- **Pulse animation** on loading screen
- **Shimmer effect** on skeleton cards
- **Rotating orb** with flowing lines
- **Fade transitions** between screens

## 🐛 Troubleshooting

### Module not found errors
```bash
rm -rf node_modules
npm install
```

### iOS build issues
```bash
cd ios
pod install
cd ..
npm run ios
```

### Cache issues
```bash
expo start -c
```

## 📄 License

This project is created for demonstration purposes.

## 👨‍💻 Author

Built with React Native, Expo, and attention to Figma design details.

## 🚀 Next Steps

To enhance the app further:
- [ ] Implement real Bluetooth connectivity
- [ ] Add backend API integration
- [ ] Implement user authentication
- [ ] Add push notifications
- [ ] Integrate real event data
- [ ] Add map view for event locations
- [ ] Implement chat functionality
- [ ] Add QR code scanning for check-ins

---

**Enjoy building with ORBIT!** 🌍✨

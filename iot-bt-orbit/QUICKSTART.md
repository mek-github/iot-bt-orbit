# 🚀 ORBIT iOS App - Quick Start Guide

## Installation Steps

### 1. Install Dependencies

```bash
cd iot-bt-orbit
npm install
```

### 2. Start the Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser.

### 3. Run on iOS

**Option A: iOS Simulator (Mac only)**
- Press `i` in the terminal
- Or run: `npm run ios`

**Option B: Physical iPhone**
- Install "Expo Go" from the App Store
- Scan the QR code shown in the terminal or browser

## 📱 Navigation Guide

The app follows this flow automatically:

1. **Loading Splash** (3 seconds) → Shows "ORBIT" branding and welcome message
2. **Progressive Loading** (auto-advances) → Skeleton loading states
3. **Orbit Visualization** (4 seconds) → Beautiful animated orb
4. **Event Discovery** → Main screen with events list

### Bottom Navigation:
- **Left Icon (Compass)**: Home/Search
- **Right Icon (Profile)**: User Profile

### Available Screens:
- Tap an event → **Event Detail Page**
- Tap search icon → **Search/Browse Events**
- Tap profile icon → **User Profile**

## 🎨 Design Features Implemented

✅ Complete light/dark theme system
✅ 9 fully functional screens
✅ Animated loading states
✅ Signature glowing orb visualization
✅ Event cards with images and stats
✅ Expandable sections
✅ Horizontal scrolling lists
✅ Search with filters
✅ Recruiter cards with LinkedIn integration
✅ Bottom tab navigation

## 🔧 Customization

### Change User Name
Edit `App.tsx`, line 51:
```typescript
userName="Farah"  // Change to your name
```

### Modify Colors
Edit `src/theme/index.ts`:
```typescript
export const Colors = {
  light: {
    accent: '#4DC4C4',  // Change to your brand color
  },
  // ...
}
```

### Add Real Event Images
Replace placeholder icons in screen components with:
```typescript
<Image source={{ uri: 'your-image-url' }} style={styles.eventImage} />
```

## 📦 Project Structure

```
iot-bt-orbit/
├── App.tsx                          # Main navigation
├── src/
│   ├── screens/                     # All 9 screens
│   ├── components/                  # Reusable components
│   └── theme/                       # Design system
├── package.json                     # Dependencies
└── README.md                        # Full documentation
```

## 🐛 Common Issues

### "Cannot find module 'expo'"
```bash
npm install
```

### Port already in use
```bash
killall node
npm start
```

### Cache issues
```bash
expo start -c
```

### iOS Simulator not opening
- Make sure Xcode is installed
- Open Simulator app manually
- Then press `i` in the terminal

## 📸 Screenshots

The app implements all 9 screens from the Figma design:
1. Loading/Splash Screen (Light Theme)
2-4. Progressive Loading States
5. Animated Orbit Visualization (Dark Theme)
6. Event Discovery Card
7. Event Detail Page
8. User Profile
9. Search/Browse Events List

## 🎯 Key Technologies

- **React Native + Expo**: Framework
- **React Navigation**: Screen navigation
- **React Native Skia**: Canvas animations for orb
- **React Native Reanimated**: Smooth animations
- **TypeScript**: Type safety
- **Expo Linear Gradient**: Gradient backgrounds

## 🚀 Next Steps

Once the app is running, you can:
1. Navigate through all screens
2. Test the animations
3. Customize colors and content
4. Add real event data
5. Implement Bluetooth connectivity
6. Add backend API integration

## 📚 Documentation

Full documentation available in `README.md`

---

**Questions?** Check the main README.md for detailed information.

**Ready to launch!** Run `npm start` and enjoy! 🌍✨

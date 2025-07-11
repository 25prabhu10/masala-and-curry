# Masala and Curry Mobile App

The official mobile application for Masala and Curry food delivery service. Built with React Native and Expo for seamless cross-platform experience on iOS and Android.

## Features

- **Cross-Platform** - Single codebase for iOS and Android
- **Native Performance** - Smooth animations and interactions
- **Expo Router** - File-based routing for React Native
- **Push Notifications** - Real-time order updates
- **Offline Support** - Browse menu and manage cart offline
- **Location Services** - GPS-based delivery tracking
- **Biometric Auth** - Face ID and fingerprint login

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Platform**: [Expo](https://expo.dev/) SDK 53
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind for React Native)
- **UI Components**: Custom mobile UI library
- **State Management**: React Context and TanStack Query
- **Authentication**: Better Auth with native integration

## Getting Started

### Prerequisites

- Node.js 22.17+
- pnpm 10+
- Expo CLI
- iOS Simulator (macOS) or Android Studio

### Installation

```bash
# Install dependencies (from project root)
pnpm install
```

### Development

```bash
# Start Expo development server
pnpm --filter @mac/mobile dev

# Or from this directory
cd apps/mobile
pnpm dev
```

### Running on Devices

```bash
# iOS Simulator (macOS only)
pnpm ios

# Android Emulator
pnpm android

# Physical device (scan QR code with Expo Go app)
pnpm dev
```

## App Features

### Browse & Order

- **Menu Categories** - Organized food categories with images
- **Search & Filter** - Find dishes by name, ingredients, or dietary needs
- **Item Customization** - Modify orders with special instructions
- **Cart Management** - Add, remove, and modify items
- **Quick Reorder** - Reorder from favorite or recent orders

### User Experience

- **Onboarding** - Smooth introduction for new users
- **Profile Management** - Update personal info and preferences
- **Address Book** - Save multiple delivery addresses
- **Payment Methods** - Store multiple payment options securely
- **Order History** - View past orders with detailed receipts

### Real-time Features

- **Order Tracking** - Live updates from kitchen to delivery
- **Push Notifications** - Order status and promotional updates
- **Location Tracking** - GPS-based delivery tracking
- **Chat Support** - In-app customer service

## Design System

The mobile app uses a consistent design system with:

- **Typography** - Readable fonts optimized for mobile
- **Color Scheme** - Brand colors with accessibility compliance
- **Spacing** - Consistent padding and margins
- **Components** - Reusable UI components from `@mac/mobile-ui`
- **Icons** - Consistent iconography throughout the app

## 📁 Project Structure

```
src/
├── app/                # App router pages and layouts
│   ├── _layout.tsx     # Root layout
│   ├── index.tsx       # Home screen
│   └── +not-found.tsx  # 404 screen
├── components/         # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── styles/             # Global styles and themes
```

## Build & Release

### Development Build

```bash
# Create development build
expo build:android --type apk
expo build:ios --type simulator
```

### Production Build

```bash
# Build for app stores
expo build:android --type app-bundle
expo build:ios --type archive
```

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all
```

## Platform Support

- **iOS**: 13.0+ (iPhone and iPad)
- **Android**: API level 21+ (Android 5.0+)
- **Expo Go**: For development and testing

## Security & Privacy

- **Secure Storage** - Encrypted local storage for sensitive data
- **Biometric Authentication** - Face ID, Touch ID, and fingerprint
- **Network Security** - Certificate pinning and secure API calls
- **Privacy Compliance** - GDPR and CCPA compliant data handling

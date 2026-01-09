# Firebase Setup Guide - LawB Platform

This guide covers Firebase setup for **Web**, **Android**, and **iOS/Apple** platforms.

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `LawB` or `law-bandhu`
4. Enable/disable Google Analytics (recommended: enable)
5. Click **"Create project"**

---

## 🌐 Web Setup (Already Configured)

The web SDK is already installed and configured in this project.

### Configuration Files:
- `src/config/firebase.ts` - Firebase initialization
- `src/services/authService.ts` - Authentication methods
- `src/services/databaseService.ts` - Database operations

### Enable Authentication Providers in Firebase Console:

1. Go to **Firebase Console** > **Authentication** > **Sign-in method**
2. Enable these providers:
   - ✅ **Email/Password**
   - ✅ **Google** (configure OAuth consent screen)
   - ✅ **Apple** (requires Apple Developer account)
   - ✅ **Phone** (for OTP verification)

### Add Your Firebase Config:

1. Go to **Firebase Console** > **Project Settings** > **Your apps**
2. Click **"Add app"** > Select **Web** (</> icon)
3. Register app with nickname: `law-bandhu-web`
4. Copy the config values to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🤖 Android Setup

### Step 1: Add Android App to Firebase

1. Go to **Firebase Console** > **Project Settings** > **Your apps**
2. Click **"Add app"** > Select **Android** (robot icon)
3. Enter package name: `com.lawbandhu.app`
4. Enter app nickname: `LawBandhu Android`
5. Download `google-services.json`

### Step 2: Android Project Setup

Add these to your Android project:

**Project-level `build.gradle.kts`:**
```kotlin
plugins {
    id("com.google.gms.google-services") version "4.4.2" apply false
}
```

**App-level `build.gradle.kts`:**
```kotlin
plugins {
    id("com.android.application")
    id("com.google.gms.google-services")
}

dependencies {
    // Import the Firebase BoM
    implementation(platform("com.google.firebase:firebase-bom:34.7.0"))

    // Firebase Authentication
    implementation("com.google.firebase:firebase-auth")
    
    // Cloud Firestore (document database)
    implementation("com.google.firebase:firebase-firestore")
    
    // Realtime Database (optional)
    implementation("com.google.firebase:firebase-database")
    
    // Firebase Analytics
    implementation("com.google.firebase:firebase-analytics")
    
    // Google Sign-In
    implementation("com.google.android.gms:play-services-auth:21.2.0")
}
```

### Step 3: Place google-services.json

Copy `google-services.json` to: `android/app/google-services.json`

### Step 4: Initialize Firebase in Android

**Kotlin (Application class):**
```kotlin
import com.google.firebase.FirebaseApp

class LawBandhuApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}
```

---

## 🍎 Apple/iOS Setup

### Step 1: Add iOS App to Firebase

1. Go to **Firebase Console** > **Project Settings** > **Your apps**
2. Click **"Add app"** > Select **iOS** (Apple icon)
3. Enter Bundle ID: `com.lawbandhu.app`
4. Enter app nickname: `LawBandhu iOS`
5. Download `GoogleService-Info.plist`

### Step 2: iOS Project Setup (Swift Package Manager)

In Xcode:
1. Go to **File** > **Add Package Dependencies**
2. Enter: `https://github.com/firebase/firebase-ios-sdk`
3. Select version: **11.0.0** or later
4. Add these packages:
   - ✅ FirebaseAuth
   - ✅ FirebaseFirestore
   - ✅ FirebaseDatabase
   - ✅ FirebaseAnalytics

### Alternative: CocoaPods

**Podfile:**
```ruby
platform :ios, '15.0'

target 'LawBandhu' do
  use_frameworks!

  # Firebase
  pod 'Firebase/Auth'
  pod 'Firebase/Firestore'
  pod 'Firebase/Database'
  pod 'Firebase/Analytics'
  
  # Google Sign-In
  pod 'GoogleSignIn'
end
```

Run: `pod install`

### Step 3: Place GoogleService-Info.plist

1. Drag `GoogleService-Info.plist` into your Xcode project
2. Make sure "Copy items if needed" is checked
3. Add to target: LawBandhu

### Step 4: Initialize Firebase in iOS

**AppDelegate.swift:**
```swift
import UIKit
import Firebase

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        return true
    }
}
```

**SwiftUI (App struct):**
```swift
import SwiftUI
import Firebase

@main
struct LawBandhuApp: App {
    init() {
        FirebaseApp.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Step 5: Configure Apple Sign-In

1. In Apple Developer Portal:
   - Enable **Sign in with Apple** capability
   - Create a Service ID for web authentication

2. In Firebase Console:
   - Go to **Authentication** > **Sign-in method** > **Apple**
   - Add your Service ID and configure OAuth

---

## 🔐 Enable Firestore Database

1. Go to **Firebase Console** > **Firestore Database**
2. Click **"Create database"**
3. Choose location (recommended: `asia-south1` for India)
4. Start in **test mode** (for development)

### Production Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cases - users can only access their own cases
    match /cases/{caseId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Lawyers - readable by authenticated users
    match /lawyers/{lawyerId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only
    }
  }
}
```

---

## 📱 Realtime Database Setup (Optional)

1. Go to **Firebase Console** > **Realtime Database**
2. Click **"Create Database"**
3. Choose location
4. Set security rules

---

## ✅ Testing Your Setup

### Web (already configured):
```typescript
import { auth } from './src/config/firebase';
import { signInWithGoogle } from './src/services/authService';

// Test Google Sign-In
const result = await signInWithGoogle();
console.log('User:', result.user);
```

### Verify in Console:
- Check **Authentication** > **Users** for signed-in users
- Check **Firestore** for stored data

---

## 🚀 Next Steps

1. Copy `.env.example` to `.env` and add your Firebase config
2. Enable desired authentication providers in Firebase Console
3. Set up Firestore security rules for production
4. Test authentication flows

For any issues, check the [Firebase Documentation](https://firebase.google.com/docs).

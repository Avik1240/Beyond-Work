# Firebase Setup Guide for ByondWork

## Complete Step-by-Step Process

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - **Project name**: Enter `ByondWork` (or your preferred name)
   - Click "Continue"
   
3. **Google Analytics (Optional)**
   - Choose whether to enable Google Analytics (recommended for production)
   - If yes, select or create an Analytics account
   - Click "Create project"
   - Wait for project creation (30-60 seconds)

### Step 2: Register Web App

1. **Add Web App**
   - On the Firebase Console homepage, click the **Web icon** (`</>`)
   - Or go to Project Settings → General → Your apps → Add app → Web

2. **Register App**
   - **App nickname**: `ByondWork Web App`
   - ✅ Check "Also set up Firebase Hosting" (optional, for deployment later)
   - Click "Register app"

3. **Copy Firebase Configuration**
   - You'll see a code snippet with your Firebase config
   - **IMPORTANT**: Copy these values (keep this window open)
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "beyondwork-xxxxx.firebaseapp.com",
     projectId: "beyondwork-xxxxx",
     storageBucket: "beyondwork-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

### Step 3: Enable Authentication

1. **Navigate to Authentication**
   - In Firebase Console left sidebar, click **"Authentication"**
   - Click **"Get started"** button

2. **Enable Email/Password Authentication**
   - Go to "Sign-in method" tab
   - Click on **"Email/Password"**
   - Toggle **"Enable"** switch to ON
   - Click "Save"

3. **Enable Google Sign-In**
   - Still in "Sign-in method" tab
   - Click on **"Google"**
   - Toggle **"Enable"** switch to ON
   - **Project support email**: Select your email from dropdown
   - Click "Save"

### Step 4: Create Firestore Database

1. **Navigate to Firestore Database**
   - In Firebase Console left sidebar, click **"Firestore Database"**
   - Click **"Create database"** button

2. **Choose Database Location**
   - Select mode: **"Start in production mode"** (we'll add rules next)
   - Click "Next"

3. **Select Region**
   - Choose a region closest to your users (e.g., `asia-south1` for India)
   - Click "Enable"
   - Wait for database creation (1-2 minutes)

### Step 5: Deploy Firestore Security Rules

1. **Open Rules Tab**
   - In Firestore Database, click the **"Rules"** tab

2. **Copy Your Security Rules**
   - Open the file: `beyondwork-app/firestore.rules`
   - Copy ALL the contents

3. **Paste and Publish Rules**
   - In Firebase Console, **delete all existing rules**
   - Paste your copied rules
   - Click **"Publish"** button
   - Confirm when prompted

   **Your rules should start with:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Helper functions
       function isAuthenticated() {
   ```

### Step 6: Create Storage Bucket

1. **Navigate to Storage**
   - In Firebase Console left sidebar, click **"Storage"**
   - Click **"Get started"** button

2. **Security Rules**
   - Select: **"Start in production mode"**
   - Click "Next"

3. **Choose Location**
   - Use the **same region** as your Firestore database
   - Click "Done"

### Step 7: Set Up Firebase Cloud Messaging (Optional for MVP)

1. **Navigate to Cloud Messaging**
   - In Firebase Console left sidebar, click **"Cloud Messaging"**
   - Note: This is optional for MVP, can be set up later

### Step 8: Configure Environment Variables

1. **Create `.env.local` file**
   - In your project root: `beyondwork-app/`
   - Create a new file named: `.env.local` (exact name!)

2. **Add Firebase Configuration**
   - Copy the configuration values from Step 2
   - Paste them in this format:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=beyondwork-xxxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=beyondwork-xxxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=beyondwork-xxxxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
   ```

3. **Save the File**
   - Make sure it's saved as `.env.local` (not `.env.local.txt`)
   - The file should be in: `beyondwork-app/.env.local`

### Step 9: Restart Development Server

1. **Stop Current Server**
   - In terminal, press `Ctrl + C`

2. **Restart Server**
   ```bash
   npm run dev
   ```

3. **Verify No Errors**
   - Check terminal output
   - Should show: "✓ Ready in X seconds"
   - No Firebase errors should appear

### Step 10: Test the Application

1. **Open Browser**
   - Go to: http://localhost:3000

2. **Test Signup**
   - Click "Sign Up"
   - Enter email and password
   - Submit form
   - Should redirect to profile setup

3. **Verify in Firebase Console**
   - Go to Authentication → Users tab
   - Your test user should appear

4. **Test Google Sign-In**
   - Try signing in with Google
   - Complete the OAuth flow

### Step 11: Authorized Domains (Production Only)

**For production deployment:**

1. **Add Your Domain**
   - Go to Authentication → Settings → Authorized domains
   - Click "Add domain"
   - Add your production domain (e.g., `beyondwork.app`)
   - Vercel domains are auto-added

## Quick Reference: Where to Find Each Value

| Variable | Firebase Console Location |
|----------|--------------------------|
| API Key | Project Settings → General → Your apps → Web app |
| Auth Domain | Same as above |
| Project ID | Project Settings → General → Project ID |
| Storage Bucket | Same as above |
| Messaging Sender ID | Same as above OR Cloud Messaging → Project credentials |
| App ID | Same as above |

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check that `.env.local` file exists and has correct values

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solution**: Make sure you've enabled Email/Password and Google auth in Firebase Console

### Error: "PERMISSION_DENIED"
**Solution**: Deploy the security rules from `firestore.rules` file

### Server not picking up `.env.local` changes
**Solution**: Restart dev server (`Ctrl+C` then `npm run dev`)

## Security Checklist

✅ Firestore security rules deployed  
✅ Storage security rules set to production mode  
✅ `.env.local` added to `.gitignore` (already done)  
✅ Email/Password auth enabled  
✅ Google OAuth configured with support email  

## Next Steps After Setup

1. **Test all authentication flows** (Email, Google)
2. **Create a test event** to verify Firestore writes
3. **Test profile setup** flow
4. **Verify security rules** by testing unauthorized access
5. **Set up Firebase Hosting** for deployment (optional)

## Production Deployment Notes

When deploying to Vercel:
1. Add all `NEXT_PUBLIC_FIREBASE_*` variables to Vercel project settings
2. Add your Vercel domain to Firebase Authorized domains
3. Test all flows on staging before production

---

**Need Help?**
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Support: Check the `ERROR_RESOLUTION.md` file for common issues

# 🔥 Firebase Manual Setup Steps - Complete Checklist

## Overview
This document lists ONLY the manual steps you need to perform in Firebase Console.
All code implementation is already complete.

---

## ✅ Step 1: Firebase Admin SDK Setup (REQUIRED - 5 minutes)

### What you need to do:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Select project: **byondwork**

2. **Navigate to Service Accounts**
   - Click **⚙️ (Settings icon)** in top left
   - Click **"Project settings"**
   - Go to **"Service accounts"** tab

3. **Generate Private Key**
   - Click **"Generate new private key"** button
   - Click **"Generate key"** in the confirmation dialog
   - A JSON file will download (e.g., `byondwork-xxxxx.json`)

4. **Open the downloaded JSON file**
   - Find these two values:
     ```json
     {
       "client_email": "firebase-adminsdk-xxxxx@byondwork.iam.gserviceaccount.com",
       "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
     }
     ```

5. **Update .env.local file**
   - Open: `beyondwork-app/.env.local`
   - Add these TWO lines at the end:
     ```env
     FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@byondwork.iam.gserviceaccount.com
     FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
     ```
   - ⚠️ Important: Wrap the private_key in DOUBLE QUOTES
   - ⚠️ Keep all the `\n` characters exactly as they are

6. **Restart your development server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

7. **Test it**
   - Go to http://localhost:3000
   - Try creating an event
   - If it works → ✅ Setup complete!
   - If error → Check the private key format

**Why this is needed:**
- Without this, ALL API routes will fail
- Events, communities, bookings won't work
- Authentication will be insecure

---

## ✅ Step 2: Firestore Security Rules (REQUIRED - 2 minutes)

### What you need to do:

1. **Deploy the rules**
   ```bash
   cd beyondwork-app
   firebase deploy --only firestore:rules
   ```

2. **Verify deployment**
   - Go to Firebase Console → Firestore Database → Rules
   - You should see the updated rules
   - Check "Last deployed" timestamp

**Why this is needed:**
- Protects your database from unauthorized access
- Enforces role-based permissions
- Prevents users from tampering with data

---

## ✅ Step 3: Add Sample Data for Testing (OPTIONAL - 10 minutes)

### 3A: Add Sample Facilities

1. **Go to Firestore Database in Firebase Console**
2. **Create collection**: `facilities`
3. **Add 2-3 documents** with these fields:

**Document 1:**
```
Document ID: [Auto-generate]
Fields:
- name (string): "PlayZone Sports Complex"
- city (string): "Delhi"
- address (string): "Sector 18, Noida"
- sportsSupported (array): ["Cricket", "Football", "Badminton"]
- pricePerHour (number): 500
- contactInfo (string): "+91-9876543210"
```

**Document 2:**
```
Document ID: [Auto-generate]
Fields:
- name (string): "Urban Sports Arena"
- city (string): "Mumbai"
- address (string): "Andheri West"
- sportsSupported (array): ["Basketball", "Tennis"]
- pricePerHour (number): 800
- contactInfo (string): "+91-9876543211"
```

**Document 3:**
```
Document ID: [Auto-generate]
Fields:
- name (string): "Champions Ground"
- city (string): "Bangalore"
- address (string): "Koramangala, 5th Block"
- sportsSupported (array): ["Cricket", "Football"]
- pricePerHour (number): 600
- contactInfo (string): "+91-9876543212"
```

---

### 3B: Complete Some Events (for Leaderboards)

1. **Create some events** through the app
2. **Join them** with your account
3. **Mark them as COMPLETED** in Firestore:
   - Go to `events` collection
   - Open an event document
   - Change `status` from "UPCOMING" to "COMPLETED"
4. **Trigger leaderboard calculation**:
   - Get your auth token from browser dev tools
   - Call: POST `http://localhost:3000/api/leaderboards`
   - Add header: `Authorization: Bearer YOUR_TOKEN`

---

## ✅ Step 4: Set Up Corporate Admin (OPTIONAL - 5 minutes)

### To test corporate admin features:

1. **Create a test user** (if not already)
2. **Update user document in Firestore**:
   - Go to `users` collection
   - Find your user document
   - Change `role` field from "USER" to "CORPORATE_ADMIN"
   - Ensure `company` field has a value (e.g., "TCS")
3. **Refresh the app**
4. **You should now see**:
   - Corporate Admin button on dashboard
   - Access to /corporate pages
   - Ability to create internal events

---

## ❌ Steps NOT Needed (Already Done or Not Required)

### ✅ Already Configured:
- Firebase Authentication (Email + Google)
- Firestore Database
- Firebase project creation
- Environment variables for client-side Firebase
- All collections and schemas

### ⏭️ Skipped for MVP:
- Firebase Cloud Messaging (notifications)
- Firebase Hosting deployment
- Firebase Cloud Functions deployment
- Payment gateway setup
- Email service setup

---

## 🧪 Testing Checklist

After completing Step 1 (Admin SDK):

- [ ] Can create events
- [ ] Can join events
- [ ] Can create communities
- [ ] Can join communities
- [ ] Can view facilities
- [ ] Can create bookings
- [ ] Dashboard shows real stats
- [ ] Leaderboards load (may be empty if no completed events)
- [ ] Corporate admin can create internal events (if role set)

---

## 🆘 Troubleshooting

### Error: "Missing or invalid authorization header"
**Solution**: Check that private key is in .env.local and server was restarted

### Error: "Invalid token"
**Solution**: Make sure private key includes BEGIN and END lines, with all \n characters

### Error: "PERMISSION_DENIED"
**Solution**: Deploy Firestore rules: `firebase deploy --only firestore:rules`

### Events not being created
**Solution**: Check browser console for errors, verify token verification is working

### Leaderboards empty
**Solution**: Mark some events as COMPLETED in Firestore, then call POST /api/leaderboards

---

## ✅ Summary: What YOU Need to Do

1. **REQUIRED (5 min)**: Set up Firebase Admin SDK (Step 1)
2. **REQUIRED (2 min)**: Deploy Firestore rules (Step 2)
3. **Optional (10 min)**: Add sample facilities (Step 3A)
4. **Optional (5 min)**: Test corporate admin (Step 4)

**Total Required Time: ~7 minutes**

After this, your MVP is fully functional! 🎉

---

## 📁 Related Documents

- **Detailed Admin Setup**: `FIREBASE_ADMIN_SETUP.md`
- **Development Summary**: `DEVELOPMENT_COMPLETE.md`
- **Security Rules**: `FIRESTORE_RULES.md`
- **General Setup**: `SETUP.md`

---

Last Updated: January 20, 2026

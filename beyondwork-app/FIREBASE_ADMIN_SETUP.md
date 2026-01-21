# 🔥 Firebase Admin SDK Setup - REQUIRED

## ⚠️ CRITICAL: You MUST complete these steps for the app to work!

All API routes now use Firebase Admin SDK for secure token verification. Without these credentials, **none of the core features will work** (events, communities, leaderboards, etc.).

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **byondwork**

---

### Step 2: Generate Service Account Key

1. Click on **⚙️ Project Settings** (gear icon in top left)
2. Go to the **"Service accounts"** tab
3. Click **"Generate New Private Key"** button
4. A JSON file will be downloaded to your computer

---

### Step 3: Extract Required Values

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "byondwork",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@byondwork.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

You need to copy **TWO values**:
1. `client_email` 
2. `private_key`

---

### Step 4: Update .env.local File

1. Open your `.env.local` file (in the root of the project)
2. Add these **TWO new lines** at the end:

```env
# Firebase Admin SDK (Server-side) - REQUIRED
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@byondwork.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The private key MUST be wrapped in **double quotes**
- Keep the `\n` characters exactly as they are in the JSON
- Make sure there are NO extra spaces or line breaks

---

### Step 5: Restart Development Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Verification

### Test if it's working:

1. Go to http://localhost:3000
2. Sign up or login
3. Try creating an event
4. If it works without errors → ✅ Setup complete!

### If you see errors:

Common issues:
- **"Missing or invalid authorization header"** → Check if private key is correctly formatted
- **"Invalid token"** → Make sure you copied the ENTIRE private key including BEGIN and END lines
- **Server won't start** → Check for syntax errors in .env.local (missing quotes, extra spaces)

---

## 🔒 Security Notes

- ⚠️ **NEVER commit `.env.local` to Git** (it's already in `.gitignore`)
- ⚠️ **NEVER share your private key publicly**
- ⚠️ Keep the downloaded JSON file in a secure location (delete it after copying values)

---

## 📝 What This Enables

With Firebase Admin SDK configured, your app can now:
- ✅ Verify user authentication tokens securely
- ✅ Create events, communities, and bookings
- ✅ Enforce role-based access control (Corporate Admin vs User)
- ✅ Calculate and update leaderboards
- ✅ Perform secure server-side operations

---

## 🆘 Need Help?

If you're stuck, check:
1. Is the private key wrapped in quotes?
2. Did you copy the ENTIRE key (including -----BEGIN and -----END)?
3. Did you restart the dev server after updating .env.local?
4. Are there any typos in the environment variable names?

---

**This is a ONE-TIME setup. Once done, you won't need to do it again!**

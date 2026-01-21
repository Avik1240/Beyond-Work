import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Cloud Function triggered when a new user is created
 * Creates a user profile in Firestore
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const {uid, email, displayName, photoURL} = user;

  try {
    // Create user profile in Firestore
    await admin.firestore().collection("users").doc(uid).set({
      email: email || "",
      name: displayName || "",
      photoURL: photoURL || "",
      role: "EMPLOYEE",
      company: "",
      employeeId: "",
      department: "",
      location: "",
      sportsInterests: [],
      skillLevel: "",
      availability: [],
      stats: {
        eventsAttended: 0,
        eventsCreated: 0,
        communitiesJoined: 0,
        totalPoints: 0,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`User profile created for ${uid}`);
  } catch (error) {
    functions.logger.error("Error creating user profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to create user profile"
    );
  }
});

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Cloud Function triggered when an event status changes to COMPLETED
 * Updates user stats and triggers leaderboard recalculation
 */
export const onEventCompleted = functions.firestore
  .document("events/{eventId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Check if status changed to COMPLETED
    if (beforeData.status !== "COMPLETED" && afterData.status === "COMPLETED") {
      const eventId = context.params.eventId;
      const participants = afterData.participants || [];

      try {
        // Update stats for all participants
        const batch = admin.firestore().batch();

        for (const participantId of participants) {
          const userRef = admin.firestore().collection("users")
            .doc(participantId);
          batch.update(userRef, {
            "stats.eventsAttended": admin.firestore.FieldValue.increment(1),
            "stats.totalPoints": admin.firestore.FieldValue.increment(10),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Update stats for event creator
        if (afterData.createdBy) {
          const creatorRef = admin.firestore().collection("users")
            .doc(afterData.createdBy);
          batch.update(creatorRef, {
            "stats.eventsCreated": admin.firestore.FieldValue.increment(1),
            "stats.totalPoints": admin.firestore.FieldValue.increment(5),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        await batch.commit();

        functions.logger.info(
          `Updated stats for event ${eventId} with ${participants.length} participants`
        );
      } catch (error) {
        functions.logger.error("Error updating participant stats:", error);
      }
    }
  });

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Scheduled function to calculate leaderboards
 * Runs daily at midnight
 */
export const calculateLeaderboardsScheduled = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    try {
      await calculateLeaderboards();
      functions.logger.info("Leaderboards calculated successfully");
    } catch (error) {
      functions.logger.error("Error calculating leaderboards:", error);
    }
  });

/**
 * HTTP callable function to manually trigger leaderboard calculation
 */
export const calculateLeaderboardsManual = functions.https.onCall(
  async (data, context) => {
    // Check if user is authenticated and is admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      await calculateLeaderboards();
      return {success: true, message: "Leaderboards calculated successfully"};
    } catch (error) {
      functions.logger.error("Error calculating leaderboards:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to calculate leaderboards"
      );
    }
  }
);

/**
 * Calculate leaderboards based on event participation
 */
async function calculateLeaderboards() {
  const db = admin.firestore();

  // Get all completed events
  const eventsSnapshot = await db
    .collection("events")
    .where("status", "==", "COMPLETED")
    .get();

  const userScores: Record<string, {
    userId: string;
    userName: string;
    company: string;
    eventsAttended: number;
    sportTypes: Record<string, number>;
  }> = {};

  // Calculate scores from events
  for (const eventDoc of eventsSnapshot.docs) {
    const event = eventDoc.data();
    const participants = event.participants || [];

    for (const participantId of participants) {
      if (!userScores[participantId]) {
        const userDoc = await db.collection("users").doc(participantId).get();
        const userData = userDoc.data();

        userScores[participantId] = {
          userId: participantId,
          userName: userData?.name || "Unknown",
          company: userData?.company || "",
          eventsAttended: 0,
          sportTypes: {},
        };
      }

      userScores[participantId].eventsAttended += 1;
      const sportType = event.sportType || "OTHER";
      userScores[participantId].sportTypes[sportType] =
        (userScores[participantId].sportTypes[sportType] || 0) + 1;
    }
  }

  // Create global leaderboards for each sport type
  const sportTypes = ["ALL", "Cricket", "Football", "Basketball",
    "Tennis", "Badminton", "OTHER"];

  for (const sportType of sportTypes) {
    let rankings;

    if (sportType === "ALL") {
      rankings = Object.values(userScores)
        .sort((a, b) => b.eventsAttended - a.eventsAttended)
        .map((user, index) => ({
          rank: index + 1,
          userId: user.userId,
          userName: user.userName,
          company: user.company,
          score: user.eventsAttended,
        }));
    } else {
      rankings = Object.values(userScores)
        .filter((user) => user.sportTypes[sportType] > 0)
        .sort((a, b) =>
          (b.sportTypes[sportType] || 0) - (a.sportTypes[sportType] || 0)
        )
        .map((user, index) => ({
          rank: index + 1,
          userId: user.userId,
          userName: user.userName,
          company: user.company,
          score: user.sportTypes[sportType] || 0,
        }));
    }

    // Store leaderboard
    const leaderboardId = `global_${sportType.toLowerCase()}`;
    await db.collection("leaderboards").doc(leaderboardId).set({
      type: "GLOBAL",
      sportType: sportType,
      rankings: rankings,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Create corporate leaderboards grouped by company
  const companiesSet = new Set(
    Object.values(userScores)
      .map((user) => user.company)
      .filter(Boolean)
  );

  for (const company of companiesSet) {
    const companyUsers = Object.values(userScores).filter(
      (user) => user.company === company
    );

    for (const sportType of sportTypes) {
      let rankings;

      if (sportType === "ALL") {
        rankings = companyUsers
          .sort((a, b) => b.eventsAttended - a.eventsAttended)
          .map((user, index) => ({
            rank: index + 1,
            userId: user.userId,
            userName: user.userName,
            company: user.company,
            score: user.eventsAttended,
          }));
      } else {
        rankings = companyUsers
          .filter((user) => user.sportTypes[sportType] > 0)
          .sort((a, b) =>
            (b.sportTypes[sportType] || 0) - (a.sportTypes[sportType] || 0)
          )
          .map((user, index) => ({
            rank: index + 1,
            userId: user.userId,
            userName: user.userName,
            company: user.company,
            score: user.sportTypes[sportType] || 0,
          }));
      }

      if (rankings.length > 0) {
        const leaderboardId =
          `corporate_${company.toLowerCase()}_${sportType.toLowerCase()}`;
        await db.collection("leaderboards").doc(leaderboardId).set({
          type: "CORPORATE",
          company: company,
          sportType: sportType,
          rankings: rankings,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
  }
}

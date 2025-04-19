import {FirebaseAdmin} from "../config/firebaseAdmin";
import {User} from "../models/User";

/**
 * Responsible for handling the database queries
 * for users.
 * @extends FirebaseAdmin
 */
export class UserRepository extends FirebaseAdmin {
  /**
   * A function that searches the user using its UID
   * @param {userId} userId - The unique identifier of the user.
   * @return {Promise<FirebaseFirestore.DocumentData | null | undefined>}
   * The user found by ID.
   */
  public async getUserById(userId: string)
  : Promise<FirebaseFirestore.DocumentData | null | undefined> {
    try {
      const db = this.getDb();
      console.log("🔥 Querying for user_id:", userId);

      const snapshot = await db.collection("users")
        .where("user_id", "==", userId)
        .limit(1)
        .get();

      console.log("✅ Query executed. Docs count:", snapshot.size);

      if (snapshot.empty) {
        console.log("❌ No matching documents found.");
        return null;
      }

      const data = snapshot.docs[0].data();
      console.log("🎯 User data:", data);
      return data;
    } catch (err) {
      console.error("💥 Error querying Firestore:", err);
      return null;
    }
  }

  /**
   * Retrieves all users from Firestore.
   * @return {Promise<FirebaseFirestore.DocumentData | null>}
   * An array that contains all users.
   */
  public async getUsers()
  : Promise<FirebaseFirestore.DocumentData[] | null> {
    const db = this.getDb();
    const snapshot = await db.collection("users").get();

    if (snapshot.empty) return null;

    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Creates a user in the Firestore
   * @param {user} user - The model of the user.
   */
  public async createUser(user: User): Promise<void> {
    const db = this.getDb();
    await db.collection("users").add(user);
  }

  /**
   * Updates a user
   * @param {userId} userId - UID of the user
   * @param {user} user - New details of the user
   */
  public async updateUser(userId: string, user: Partial<User>): Promise<void> {
    const db = this.getDb();
    await db.collection("users").doc(userId).update(user);
  }

  /**
   * Deletes a user
   * @param {userId} userId - UID of the user
   */
  public async deleteUser(userId: string): Promise<void> {
    const db = this.getDb();
    await db.collection("users").doc(userId).delete();
  }
}

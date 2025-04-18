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
    const db = this.getDb();
    const userDoc = await db.collection("users").doc(userId).get();

    return userDoc.exists ? userDoc.data() : null;
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

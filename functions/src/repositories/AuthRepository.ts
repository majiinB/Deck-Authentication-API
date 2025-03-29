import {FirebaseAdmin} from "../config/firebaseAdmin";

/**
 * Responsible for handling the database queries
 * and authentication methods.
 * @extends FirebaseAdmin
 */
export class AuthRepository extends FirebaseAdmin {
  /**
   * A function that searches the user using its UID
   * @param {userId} userId - The unique identifier of the user.
   * @return {Promise<FirebaseFirestore.DocumentData | null | undefined>}
   * The user found by ID.
   */
  public async getUserById(userId: string) {
    const db = this.getDb();

    const userDoc = await db.collection("users").doc(userId).get();
    return userDoc.exists ? userDoc.data() : null;
  }

  /**
 * Decodes the Firebase ID Token.
 * @param {idToken} idToken - The token.
 * @return {Promise<DecodedIdToken>} decoded Firebase ID Token.
 */
  public async decodeToken(idToken: string) {
    return this.getAuth().verifyIdToken(idToken);
  }
}

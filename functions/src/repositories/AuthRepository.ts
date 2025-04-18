import {CreateRequest, ListUsersResult,
  UpdateRequest, UserRecord} from "firebase-admin/auth";
import {FirebaseAdmin} from "../config/firebaseAdmin";

/**
 * Responsible for handling the database queries
 * and authentication methods.
 * @extends FirebaseAdmin
 */
export class AuthRepository extends FirebaseAdmin {
  /**
 * Decodes the Firebase ID Token.
 * @param {idToken} idToken - The token.
 * @return {Promise<DecodedIdToken>} decoded Firebase ID Token.
 */
  public async decodeToken(idToken: string) {
    return this.getAuth().verifyIdToken(idToken);
  }

  /**
 * Sends a password reset link to the user
 * @param {email} email - The email associated with the user.
 * @return {Promise<string>} A promise with the generated link
 * for the user to use to reset their password.
 */
  public async forgotPass(email: string): Promise<string> {
    return this.getAuth().generatePasswordResetLink(email);
  }

  /**
   * Creates an user to the Firebase Authentication
   * @param {data} data - The details to be created for
   * the user.
   * @return {Promise<UserRecord>} A promise containing the
   *  created user details.
   */
  public async createUser(data: CreateRequest): Promise<UserRecord> {
    return this.getAuth().createUser(data);
  }

  /**
   * Updates an user from the Firebase Authentication
   * @param {userId} userId - The UID of the user.
   * @param {data} data - The new details to be updated for
   * the user.
   * @return {Promise<UserRecord>} A promise containing the
   * updated user details.
   */
  public async updateUser(userId: string, data : UpdateRequest)
  : Promise<UserRecord> {
    return this.getAuth().updateUser(userId, data);
  }

  /**
   * Deletes an existing user from Firebase Authentication.
   * @param {userId} userId - The UID of the user.
   * @return {Promise<void>} A empty promise indicating
   * the selected user is deleted.
   */
  public async deleteUser(userId: string): Promise<void> {
    return this.getAuth().deleteUser(userId);
  }

  /**
   * Gets the user from Firebase Authentication using uid
   * @param {userId} userId - The UID of the user.
   * @return {Promise<UserRecord>} A promise containing
   * the details of the user.
   */
  public async getUserById(userId: string): Promise<UserRecord> {
    return await this.getAuth().getUser(userId);
  }

  /**
   * Gets the user from Firebase Authentication using email
   * @param {email} email - The email associated of the user.
   * @return {Promise<UserRecord>} A promise containing
   * the details of the user.
   */
  public async getUserByEmail(email: string)
  : Promise<UserRecord> {
    return await this.getAuth().getUserByEmail(email);
  }

  /**
   * Gets all users from Firebase Authentication
   * @param {maxUsers} maxUsers - (optional)
   * number of users to be retrieved
   * @param {page} page - (optional) offset.
   * @return {Promise<ListUsersResult>} A promise
   * containing the list of users.
   */
  public async getAllUsers(maxUsers?: number, page?: string)
  : Promise<ListUsersResult> {
    return await this.getAuth().listUsers(maxUsers, page);
  }
}

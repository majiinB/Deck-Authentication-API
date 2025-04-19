import {BaseResponse} from "../models/BaseResponse";
import {User} from "../models/User";
import {UserRepository} from "../repositories/UserRepository";
/**
 * Service class responsible for handling user-related operations
 */
export class UserService {
  private userRepository : UserRepository;
  /**
   * Initializes the class with UserRepository
   * @param {userRepository} userRepository
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Gets the role of the user.
   * @param {userId} userId - The UID of the user.
   * @return {Promise<BaseResponse>} JSON Response containing the role.
   */
  public async getUserRole(userId: string): Promise<BaseResponse> {
    try {
      const userDoc = await this.userRepository.getUserById(userId);

      if (!userDoc || !userDoc.exists) {
        return {success: false, message: "User not found"};
      }
      const role = userDoc.data()?.role as string | null;
      return {success: true, message: role};
    } catch (error) {
      return {success: false, message: error};
    }
  }

  /**
   * Get the user details in Firestore.
   * @param {userId} userId - UID of the user.
   * @return {Promise<BaseResponse>} JSON Response containing
   * the details of the user
   */
  public async getUserDetails(userId:string)
  : Promise<
      BaseResponse | (FirebaseFirestore.DocumentData | null | undefined)
    > {
    try {
      const userDoc = await this.userRepository.getUserById(userId);

      if (!userDoc) {
        return {success: false, message: "User not found"};
      }

      return {success: true, message: userDoc};
    } catch (error) {
      return {success: false, message: error};
    }
  }

  /**
   * Creates user in the Firestore.
   * @param {uid} uid - Unique identifier of the user
   * @param {email} email - Email associated with the user
   * @param {name} name - Name of the user
   */
  public async createUser(uid: string, email: string, name: string)
  : Promise<BaseResponse> {
    const user: User = {
      "user_id": uid,
      "email": email,
      "name": name,
      "role": "student",
      "cover_photo": "",
      "fcm_token": "",
    };

    try {
      await this.userRepository.createUser(user);
      return {success: true, message: "Successfully created user!"};
    } catch (error) {
      return {success: false, message: error};
    }
  }

  /**
   * Updates the user in Firestore
   * @param {uid} uid - UID of the user
   * @param {data} data - values to be updated
   * @return {Promise<BaseResponse>} - JSON Response
   * containing a message successfully updated the user
   */
  public async updateUser(uid: string, data: User)
  : Promise<BaseResponse> {
    try {
      await this.userRepository.updateUser(uid, data);
      return {success: true, message: "Successfully updated user!"};
    } catch (error) {
      return {success: false, message: error};
    }
  }

  /**
   * Gets all users in Firestore.
   * @return {Promise<BaseResponse>} JSON Response
   * containing all users.
   */
  public async getAllUsers(): Promise<BaseResponse> {
    try {
      const users = await this.userRepository.getUsers();

      if (!users) {
        return {success: false, message: "Failed to fetch all users."};
      }

      return {success: true, message: users};
    } catch (error) {
      return {success: false, message: error};
    }
  }

  /**
   * Deletes a user from Firestore.
   * @param {userId} userId - UID of the user
   * @return {Promise<BaseResponse>} Promise indicating
   * the status of the deletion.
   */
  public async deleteUser(userId: string): Promise<BaseResponse> {
    try {
      await this.userRepository.deleteUser(userId);
      return {success: true, message: "Successfully deleted user."};
    } catch (error) {
      return {success: false, message: error};
    }
  }
}

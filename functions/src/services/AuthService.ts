import {AuthRepository} from "../repositories/AuthRepository";
/**
 * Service class responsible for handling auth-related operations
 */
export class AuthService {
  private authRepository : AuthRepository;
  /**
   * Initializes the class with AuthRepository
   * @param {authRepository} authRepository
   */
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Verifies the decoded Firebase ID Token.
   * @param {idToken} idToken
   * @return {Promise<any>} JSON response that indicates the
   * verification of the Firebase ID Token.
   */
  public async verifyToken(idToken: string) : Promise<any> {
    try {
      const decodedToken = await this.authRepository.decodeToken(idToken);
      const uid = decodedToken.uid;

      return {success: true, uid};
    } catch (error) {
      return {success: false, message: "Invalid token", error: error};
    }
  }
}

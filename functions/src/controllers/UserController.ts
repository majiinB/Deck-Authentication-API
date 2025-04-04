import {Request, Response} from "express";
import {UserService} from "../services/UserService";
/**
 * This class is responsible for managing user services.
 */
export class UserController {
  /**
   * Service responsible for handling user operations.
   */
  private userService : UserService;
  /**
   * Initializes the class with UserService
   * @param {userService} userService
   */
  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
  * Handles the identification of the user's role
  * @param {Request} req - The HTTP request object.
  * @param {Response} res - The HTTP response object.
  * @return {Promise<void>} A JSON response containing the action.
  */
  public async getUserRole(req : Request, res : Response): Promise<void> {
    try {
      const {userId} = req.params;
      const role = await this.userService.getUserRole(userId);

      if (!role) {
        res.status(400).json({success: false, message: "User not found."});
        return;
      }

      res.status(200).json(role);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in obtaining the user's role.");
      }
    }
  }

  /**
  * Handles creating a user to be stored in Firestore.
  * @param {Request} req - The HTTP request object.
  * @param {Response} res - The HTTP response object.
  * @return {Promise<void>} A JSON response containing the action.
   */
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {uid, email, name} = req.body;
      const creation = await this.userService.createUser(uid, email, name);
      if (!creation) {
        res.status(400).json({success: false,
          message: "Account creation failed."});
        return;
      }

      res.status(200).json(creation);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in creating the account.");
      }
    }
  }

  /**
   * Sends the user's details in Firestore.
   * @param {req} req - HTTP Request
   * @param {res} res - HTTP Response
   * @return {Promise<void>} An empty promise sending the JSON
   * response containing the user details.
   */
  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const {uid} = req.body;
      const details = await this.userService.getUserDetails(uid);
      if (!details) {
        res.status(400).json({success: false, message: "Unable to find user."});
        return;
      }

      res.status(200).json(details);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in creating the account.");
      }
    }
  }
}

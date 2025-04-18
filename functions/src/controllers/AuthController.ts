import {Request, Response} from "express";
import {AuthService} from "../services/AuthService";
import {UserRecord} from "firebase-admin/auth";

/**
 * This class is responsible for managing auth services.
 */
export class AuthController {
  /**
   * Service responsible for handling authentication operations.
   */
  private authService : AuthService;
  /**
   * Initializes the class with AuthService
   * @param {authService} authService
   */
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Fetches user by id at Firebase Authentication.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   */
  public async getUserById(req: Request, res?: Response)
  : Promise<void | UserRecord> {
    try {
      const {uid} = req.body;
      const user = await this.authService.getUserById(uid);

      if (!res) {
        return user;
      }

      if (user) {
        res.status(400).json({
          success: false,
          message: "Failed getting user by uid.",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in getting user by id");
      }
    }
  }

  /**
   * Fetches user by id at Firebase Authentication.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   */
  public async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const {email} = req.body;
      const user = await this.authService.getUserByEmail(email);

      if (user) {
        res.status(400).json({
          success: false,
          message: "Failed getting user by email.",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in getting user by email");
      }
    }
  }

  /**
     * Handles the verification of the Firebase ID Token
     * and obtains the user details from Firebase
     * Authentication.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * @return {Promise<void>} A JSON response containing the
     * decoded token, the UID of the user and its details
     * from Firebase Authentication.
     */
  public async confirmToken(req : Request, res : Response): Promise<void> {
    try {
      const {token} = req.body;

      if (!token) {
        res.status(400).json({success: false, message: "Token is required"});
        return;
      }

      const verifiedToken = await this.authService.verifyToken(token);
      if (!verifiedToken.success || !verifiedToken.message.uid) {
        res.status(401).json("Unable to verify token.");
        return;
      }

      const userDetails = await this.authService.getUserById(
        verifiedToken.message.uid);
      if (!userDetails) {
        res.status(401).json("Unable to find user.");
        return;
      }

      res.status(200).json({verifiedToken, userDetails});
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in verifying firebase token.");
      }
    }
  }

  /**
   * Updates user name after creating account.
   * @param {req} req
   * @param {res} res
   */
  public async updateAccountName(req: Request, res: Response): Promise<void> {
    try {
      const {uid, name} = req.body;
      const update = await this.authService.updateUser(uid,
        {displayName: name});
      if (!update) {
        res.status(401).json("Unable to update user's name");
        return;
      }

      res.status(200).json("Successfully updated user name");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in updating account name.");
      }
    }
  }

  /**
   * Sends pass link to user via their associated email.
   * @param {req} req
   * @param {res} res
   */
  public async sendChangePasswordLink(
    req: Request, res: Response
  ): Promise<void> {
    try {
      const {email} = req.body;
      const send = await this.authService.forgetPass(email);

      if (!send) {
        res.status(400).json({
          success: false,
          message: "Failed to send change password link",
        });
        return;
      }

      res.status(200).json(send);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in "+
          "sending change password link");
      }
    }
  }

  /**
   * Updates the user in Firebase Authentication.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} Promise that contains
   * the status of updating the user.
   */
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const {uid, userDetails} = req.body;
      const update = await this.authService.updateUser(uid, userDetails);

      if (!update) {
        res.status(400).json({
          success: false,
          message: "Failed to update user",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Successfully updated user",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in "+
          "updating user");
      }
    }
  }

  /**
   * Changes the user's photo in Firebase Authentication.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} Promise that contains
   * the status of changing the user's photo.
   */
  public async changeProfilePhoto(req: Request, res: Response)
  : Promise<void> {
    try {
      const {uid, profilePicURL} = req.body;
      const update = await this.authService
        .updateUser(uid, {photoURL: profilePicURL});

      if (!update) {
        res.status(400).json({
          success: false,
          message: "Failed change photo.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Successfully change photo",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in "+
          "updating photo.");
      }
    }
  }

  /**
   * Disables a user in Firebase Authentication.
   * Using this forbids the user to access the application.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A response containing
   * the status of disabling the user.
   */
  public async disableUser(req: Request, res: Response)
  : Promise<void> {
    try {
      const {userId} = req.body;
      const disable = await this.authService
        .updateUser(userId, {disabled: true});

      if (!disable) {
        res.status(400).json({
          success: false,
          message: "Failed to disable user.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Successfully disabled user.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in "+
          "disabling user.");
      }
    }
  }

  /**
   * Enables a user in Firebase Authentication.
   * Using this re-allows the user to access the application.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A response containing
   * the status of enabling the user.
   */
  public async enableUser(req: Request, res: Response)
  : Promise<void> {
    try {
      const {userId} = req.body;
      const enable = await this.authService
        .updateUser(userId, {disabled: false});

      if (!enable) {
        res.status(400).json({
          success: false,
          message: "Failed to enable user.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Successfully enabled user.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in "+
          "enabling user.");
      }
    }
  }
}

import {Router, Request, Response} from "express";
import {AuthController} from "../controllers/AuthController";
import {AuthService} from "../services/AuthService";
import {AuthRepository} from "../repositories/AuthRepository";
import {UserController} from "../controllers/UserController";
import {UserService} from "../services/UserService";
import {UserRepository} from "../repositories/UserRepository";
// eslint-disable-next-line new-cap
const router = Router();
const authController = new AuthController(
  new AuthService(
    new AuthRepository()));
const userController = new UserController(
  new UserService(
    new UserRepository()));


/* GENERAL ROUTES */

/**
 *
 * @route POST api/v1/auth/verify_token
 * @description Verifies the Firebase ID Token sent from the website.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/verify-token", async (req: Request, res: Response) => {
  await authController.confirmToken(req, res);
});

/**
 * @route POST api/vi/auth/create-account
 * @description Creates an account in the Firebase Authentication
 * and Firestore.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/create-account", async (req : Request, res: Response) => {
  await userController.createUser(req, res);
  await authController.updateAccountName(req, res);
});

/**
 * @route POST api/vi/auth/change-pass
 * @description Sends a password link to the user.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/change-pass", async (req: Request, res: Response) => {
  await authController.sendChangePasswordLink(req, res);
});

/**
 * @route PUT api/vi/auth/update-profile
 * @description Updates user profile.
 * @returns Success 200
 * @returns Error 500
 */
router.put("/update-profile", async (req: Request, res: Response) => {
  await authController.updateUser(req, res);
});

/* MODERATOR ONLY ROUTES */

/**
 * @route POST api/vi/auth/moderator/disable-user
 * @description Disables a user.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/moderator/disable-user", async (req: Request, res: Response) => {
  await authController.disableUser(req, res);
});

/**
 * @route POST api/vi/auth/moderator/enable-user
 * @description Enables a user.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/moderator/enable-user", async (req: Request, res: Response) => {
  await authController.enableUser(req, res);
});

/**
 * @route GET api/vi/auth/moderator/get-users
 * @description Fetches all users.
 * @returns Success 200
 * @returns Error 500
 */
router.get("/moderator/get-users", async (req: Request, res: Response) => {
  await userController.getUsers(req, res);
});

/**
 * @route GET api/vi/auth/moderator/get-user/auth
 * @description Fetches a selected user's auth details.
 * @returns Success 200
 * @returns Error 500
 */
router.get("/moderator/get-user/auth", async (req: Request, res: Response) => {
  await authController.getUserById(req, res);
});

/**
 * @route GET api/vi/auth/moderator/get-user/firestore
 * @description Fetches a selected user's firestore details.
 * @returns Success 200
 * @returns Error 500
 */
router.get("/moderator/get-user/firestore",
  async (req: Request, res: Response) => {
    await userController.getUser(req, res);
  }
);

export default router;

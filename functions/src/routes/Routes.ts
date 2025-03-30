import {Router, Request, Response} from "express";
import {AuthController} from "../controllers/AuthController";
import {AuthService} from "../services/AuthService";
import {AuthRepository} from "../repositories/AuthRepository";
// eslint-disable-next-line new-cap
const router = Router();
const authController = new AuthController(new AuthService(new AuthRepository));

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

export default router;

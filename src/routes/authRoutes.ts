import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authValidations } from "../middlewares/authValidations";
import { validationResponse } from "../middlewares/validationResponse";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post(
  "/create-account",
  authValidations.authData,
  validationResponse,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  authValidations.token,
  validationResponse,
  AuthController.confirmAccount
);

router.post(
  "/login",
  authValidations.loginData,
  validationResponse,
  AuthController.login
);

router.post(
  "/request-code",
  authValidations.newTokenData,
  validationResponse,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  authValidations.newTokenData,
  validationResponse,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  authValidations.validatetoken,
  validationResponse,
  AuthController.validateToken
);

router.post(
  "/new-password/:token",
  authValidations.newPassword,
  validationResponse,
  AuthController.newPassword
);

router.get(
  "/user", 
    authenticate, 
    AuthController.user
);

/** Profile */
router.put(
  "/profile",
  authenticate,
  authValidations.updateProfile,
  validationResponse,
  AuthController.updateProfile
);

router.post(
  '/update-password',
    authenticate,
    authValidations.updateCurretnUserPassword,
    validationResponse,
    AuthController.updateCurrentPassword
)

router.post(
  '/check-password',
  authenticate,
  authValidations.checkPwd,
  validationResponse,
  AuthController.checkPassword
)

export default router;

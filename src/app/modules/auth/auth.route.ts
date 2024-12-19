import express from "express";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import validateRequest from '../../middlewares/validateRequest';
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../user/user.constant";

const router  = express.Router();


router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
  );

router.post(
    '/change-password', 
    auth(USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
  );

  router.post(
    '/refresh-token', 
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
  );


  export const AuthRoutes = router;
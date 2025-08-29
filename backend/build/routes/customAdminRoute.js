import express from "express";
import { signInMiddleware, signUpMiddleware, logOutMiddleWare, validateUserAuthMiddleware } from "../middleware/customAuthMiddleware.js";
import { signInController, signUpController, logOutController, validateUserAuthController } from "../Controller/customAuthController.js";
const customAuth = express.Router();
customAuth.post('/signin', signInMiddleware, signInController);
customAuth.post('/signup', signUpMiddleware, signUpController);
customAuth.post('/logout', logOutMiddleWare, logOutController);
customAuth.get('/validate', validateUserAuthMiddleware, validateUserAuthController);
export default customAdminAuthRoute;

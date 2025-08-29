import express from "express";
import { adminSignInMiddleware, adminLogOutMiddleware, validateAdminAuthMiddleware, adminSignUpMiddleware, } from "../middleware/customAdminAuth";
import { adminSignInController, adminSignUpController, adminLogOutController, validateAdminAuthController, } from "../Controller/adminAuthController";
const customAdminAuthRoute = express.Router();
customAdminAuthRoute.post("/signin", adminSignInMiddleware, adminSignInController);
customAdminAuthRoute.post("/signup", adminSignUpMiddleware, adminSignUpController);
customAdminAuthRoute.post("/logout", adminLogOutMiddleware, adminLogOutController);
customAdminAuthRoute.get("/validate", validateAdminAuthMiddleware, validateAdminAuthController);
export default customAdminAuthRoute;

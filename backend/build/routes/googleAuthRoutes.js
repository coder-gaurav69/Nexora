var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import { tokenGenerator } from "../Controller/tokenGenerator.js";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, FRONTEND_URL, MODE } from "../config.js";
import userModel from "../mongoose/Schemas/userSchema.js";
const googleRoute = express.Router();
// =================== Passport Config ===================
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const email = (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
    const existingUser = yield userModel.findOne({ email: email });
    if (existingUser) {
        const payload = {
            email: email,
            customerId: existingUser._id,
            name: profile === null || profile === void 0 ? void 0 : profile.displayName,
        };
        const [newAccessToken, newRefreshToken] = tokenGenerator(payload);
        yield userModel.findByIdAndUpdate(existingUser._id, {
            $set: { refreshToken: newRefreshToken },
        });
        const user = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            customerId: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
        };
        return done(null, user);
    }
    const newUser = yield userModel.create({
        name: profile.displayName,
        email: email,
        profilePhoto: (_d = (_c = profile === null || profile === void 0 ? void 0 : profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
    });
    const payload = {
        email: email,
        customerId: newUser._id,
        name: profile === null || profile === void 0 ? void 0 : profile.displayName,
    };
    const [myAccessToken, myRefreshToken] = tokenGenerator(payload);
    const result = yield userModel.findByIdAndUpdate(newUser._id, {
        $set: { refreshToken: myRefreshToken },
    });
    const user = {
        accessToken: myAccessToken,
        refreshToken: myRefreshToken,
        customerId: newUser === null || newUser === void 0 ? void 0 : newUser._id,
    };
    return done(null, user);
})));
// =================== Middleware App ===================
const googleMiddleware = express();
googleMiddleware.use(cookieParser());
googleMiddleware.use(passport.initialize());
// =================== Routes ===================
googleRoute.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
}));
googleRoute.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
}), (req, res) => {
    const { accessToken, refreshToken, customerId } = req.user;
    // setting cookies
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: MODE === "development" ? "strict" : "none",
        maxAge: 24 * 60 * 60 * 1000,
    };
    res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("customerId", customerId, options);
    console.log("Login successfully with Google");
    res.redirect(`${FRONTEND_URL}`);
});
export { googleRoute, googleMiddleware };

import express, { Router, Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import axios from "axios";
import { tokenGenerator } from "../Controller/tokenGenerator.js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FRONTEND_URL,
} from "../config.js";
import userModel from "../mongoose/Schemas/userSchema.js";

const googleRoute: Router = express.Router();

// =================== Passport Config ===================
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const email = profile?.emails?.[0]?.value;

      const existingUser = await userModel.findOne({ email: email });

      if (existingUser) {
        const payload = {
          email: email,
          customerId: existingUser._id,
          name: profile?.displayName,
        };
        const [newAccessToken, newRefreshToken] = tokenGenerator(payload);

        await userModel.findByIdAndUpdate(existingUser._id, {
          $set: { refreshToken: newRefreshToken },
        });

        const user = {
          accessToken:newAccessToken,
          refreshToken:newRefreshToken,
          customerId: existingUser?._id,
        };

        return done(null, user);
      }

      const newUser = await userModel.create({
        name: profile.displayName,
        email: email,
        profilePhoto: profile?.photos?.[0]?.value,
      });
      const payload = {
        email: email,
        customerId: newUser._id,
        name: profile?.displayName,
      };

      const [myAccessToken, myRefreshToken] = tokenGenerator(payload);

      const result = await userModel.findByIdAndUpdate(newUser._id, {
        $set: { refreshToken: myRefreshToken },
      });

      const user = {
        accessToken:myAccessToken,
        refreshToken:myRefreshToken,
        customerId: newUser?._id,
      };

      return done(null, user);
    }
  )
);

// =================== Middleware App ===================
const googleMiddleware = express();
googleMiddleware.use(cookieParser());
googleMiddleware.use(passport.initialize());

// =================== Routes ===================
googleRoute.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

googleRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req: Request, res: Response) => {
    const { accessToken, refreshToken, customerId } = req.user as any;

    // setting cookies
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("customerId", customerId, options);

    console.log("Login successfully with Google");
    res.redirect(`${FRONTEND_URL}`);
  }
);

export { googleRoute, googleMiddleware };

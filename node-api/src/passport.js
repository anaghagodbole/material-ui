import { ExtractJwt } from "passport-jwt";
import passportJWT from "passport-jwt";
import dotenv from "dotenv";
import passport from "passport";

import { userModel } from "./schemas/user.schema";
const JWTStrategy = passportJWT.Strategy;
dotenv.config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      return userModel
        .findOne({ _id: jwtPayload.id })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          console.error("Error in passport strategy:", err);
          return done(err, false);
        });
    }
  )
);

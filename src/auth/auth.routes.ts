import express from "express";
import passport from "passport";
import { createUserTokens } from "../common/service/passport-jwt.service";
import { createResponse } from "../common/helper/response.helper";

const router = express.Router();

// Login Route
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      return res
        .status(401)
        .json(createResponse(false, info?.message || "Unauthorized"));
    }

    // Generate tokens
    const tokens = createUserTokens(user);
    return res.json(createResponse(tokens, "Login successful"));
  })(req, res, next);
});

export default router;

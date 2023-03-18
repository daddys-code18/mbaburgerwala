import express from "express";
import passport from "passport";
import {
  getAdminStats,
  getAdminUsers,
  myprofile,
} from "../controllers/user.js";
import { logout } from "../controllers/user.js";
import { authorizedAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
router.get(
  "/login",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
  })
);
// router.get("/login", (req, res, next) => {
//   res.send("logged In");
// });
router.get("/me", isAuthenticated, myprofile);
router.get("/logout", logout);
//Admin Routes
router.get("/admin/users", isAuthenticated, authorizedAdmin, getAdminUsers);
router.get("/admin/stats", isAuthenticated, authorizedAdmin, getAdminStats);

export default router;

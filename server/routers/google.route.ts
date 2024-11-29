
import { Router } from "express";
import passport from "passport";

const router = Router();
router.get(
    "/google-login",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/google/success",
      failureRedirect: "/auth/google/failure",
    }),
  );
  
  //@ts-ignore
  router.get("/auth/google/success", (req, res) => {
      if(req.user) {
          return res.status(200).json({
              message: "success",
              user: req.user
          })
      }
  });
  
  //@ts-ignore
  router.get("/auth/failure", (req, res) => {
      return res.status(401).json({message: "failure"})
  });

export const googleRouter = router;
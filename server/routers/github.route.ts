import { Router } from "express";
import passport from "passport";

const router = Router();
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/auth/github/success");
  }
);

//@ts-ignore
router.get("/auth/github/success", (req, res) => {
  if (req.user) {
    return res.status(200).json({
      message: "success",
      user: req.user,
    });
  }
  console.log(' req : ', req);
  return res.json({"message": "sucess"});
});

//@ts-ignore
router.get("/auth/failure", (req, res) => {
  return res.status(401).json({ message: "failure" });
});

router.get('/auth/github/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  });
export const githubRouter = router;

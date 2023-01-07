const express = require("express");
const router = express.Router();
const user = require("../models/user");
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name Should be atleast 3 characters"),
    check("email")
      .isEmail()
      .withMessage("Please enter correct email")
      .custom((val) => {
        return user.findOne({ email: val }).then((user) => {
          if (user) {
            throw new Error("email already in use");
          }
        });
      }),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password Should be atleast 8 characters"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please enter correct email"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Passowrd Should be atleast 8 characters"),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.send(req.auth);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const catchAsyncError = require("../utils/CatchAsyncError");
const passport = require("passport");
const { storeReturnTo } = require('../middleware');
const users = require("../controllers/users");

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsyncError(users.register));

router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get("/logout", users.logout);

module.exports = router;
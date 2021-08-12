const express = require("express");
const router = express.Router();
const {
	preSignup,
	signup,
	signin,
	signout,
	requireSignIn,
	forgotPassword,
	resetPassword,
	googleLogin,
} = require("../controllers/auth");
//express validation (split up to individual modules)
const {
	signupValidator,
	signinValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} = require("../validators/auth");
const { runValidator } = require("../validators/index");

router.post("/presignup", signupValidator, runValidator, preSignup);
router.post("/signup", signup);
router.post("/signin", signinValidator, runValidator, signin);
router.get("/signout", signout);
router.put(
	"/forgot-password",
	forgotPasswordValidator,
	runValidator,
	forgotPassword
);
router.put(
	"/reset-password",
	resetPasswordValidator,
	runValidator,
	resetPassword
);

//google-login
router.post("/google-login", googleLogin);

module.exports = router;

const { check } = require("express-validator");

exports.signupValidator = [
	check("name").not().isEmpty().withMessage("Your name is required."),
	check("email").isEmail().withMessage("Please enter a valid email."),
	check("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long."),
];

exports.signinValidator = [
	check("email").isEmail().withMessage("Please enter a valid email."),
	check("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long."),
];

exports.forgotPasswordValidator = [
	check("email")
		.isEmail()
		.not()
		.isEmpty()
		.withMessage("Must enter a valid email address"),
];

exports.resetPasswordValidator = [
	check("newPassword")
		.not()
		.isEmpty()
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long."),
];

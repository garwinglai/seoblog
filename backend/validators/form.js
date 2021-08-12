const { check } = require("express-validator");

exports.formValidator = [
	check("name").not().isEmpty().withMessage("Name is required."),
	check("email").isEmail().withMessage("Proper email is required."),
	check("message").not().isEmpty().withMessage("Please enter a message with your form."),
];

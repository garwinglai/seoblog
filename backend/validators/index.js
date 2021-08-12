const { validationResult } = require("express-validator");

exports.runValidator = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//Different ways to return error message, map, maps to key value of error, so must be dynamic, array maps any array
		return res
			.status(400)
			.json({ error: errors.mapped(), e: errors.array()[0].msg });
	}

	next();
};

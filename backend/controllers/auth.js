const nanoid = require("nanoid");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt"); //package is used to validate jwt tokens
const Blog = require("../models/blog");
const _ = require("lodash");
//Sendgrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//Google login
const { OAuth2Client } = require("google-auth-library");

exports.preSignup = (req, res) => {
	const { name, email, password } = req.body;

	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (err) {
			return console.log(`Mongo database error when finding for presignup`);
		}

		if (user) {
			return res.json({
				error: `${email} already exists. Please signup with another email address.`,
			});
		}

		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_PRESIGNUP_SECRET,
			{ expiresIn: "1d" }
		);

		const confirmationEmail = {
			to: email, //admin email
			from: process.env.EMAIL_FROM,
			subject: "Please confirm your email address",
			html: `
				<h4>Please use the following link to confirm your email address. Link is available for 10 minutes.</h4>
				<a href=${process.env.CLIENT_URL}/auth/emailconfirm/${token}>Confirm your email here.</a>`,
		};

		(async () => {
			try {
				await sgMail.send(confirmationEmail).then((sent) => {
					return res.status(201).json({
						message: "Confirmation email sent. Please check your email.",
					});
				});
			} catch (error) {
				return res.json({
					error: `Error sending confirmation email. Please try again.`,
				});
			}
		})();
	});
};

//Signup controller

exports.signup = (req, res) => {
	console.log("foo");
	console.log(req.body);
	const token = req.body.token;

	if (token) {
		jwt.verify(token, process.env.JWT_PRESIGNUP_SECRET, (err, decoded) => {
			if (err) {
				return res.status(400).json({
					error: "Expired link. Signup again.",
				});
			}

			const { name, email, password } = jwt.decode(token);
			const username = nanoid();
			const profile = `${process.env.CLIENT_URL}/profile/${username}`;

			const newUser = new User({
				name: name,
				email: email,
				password: password,
				username: username,
				profile: profile,
			});

			newUser.save((err, user) => {
				if (err) {
					return res.status(400).json({
						error: `Problem creating new user. Please try again.`,
					});
				} else {
					res.status(200).json({
						message: "Successfully activated account.",
					});
				}
			});
		});
	} else {
		return res.json({
			error: "Something went wrong, please try again.",
		});
	}
};

// exports.signup = (req, res) => {
// 	User.findOne({ email: req.body.email }, (err, user) => {
// 		if (user) {
// 			return res.status(400).json({
// 				error: "Email has been taken",
// 			});
// 		}

// 		if (err) {
// 			return console.log("Mongoose findOne error:" + err);
// 		}

// 		const { name, password, email } = req.body;

// 		let username = nanoid();
// 		let profile = `${process.env.CLIENT_URL}/profile/${username}`;

// 		let newUser = new User({
// 			name: name,
// 			email: email,
// 			password: password,
// 			username: username,
// 			profile: profile,
// 		});
// 		newUser.save((err, user) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: err,
// 				});
// 			} else {
// 				res.status(200).json({
// 					message: "Successfully signed up",
// 				});
// 			}
// 		});
// 	});
// };

//SignIn Controller

exports.signin = (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		//check if user exists
		if (err || !user) {
			return res.status(400).json({
				error: "The email does not exist. Please sign up.",
			});
		}

		//authenticate user
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "The Email and password do not match.",
			});
		}

		//provide token || Once a user is logged in, each subsequent request will require the JWT, allowing the user to access routes, services, and resources that are permitted with that token.
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});
		res.cookie("token", token, { expiresIn: "1d" });

		const { username, name, profile, role, _id } = user;

		return res.json({
			token,
			user: { username, name, profile, role, _id },
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "Successfully signed out",
	});
};

//Express jwt will validate the token provided during signin. This validation will occur for each subsequet request until destroyed.
//We can use this for pages that "require to be signed in", so we can validate the token
exports.requireSignIn = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ["HS256"], // added later HS256 is symmetric algo (1 key only, must be kept safe) while RS256 is assymetric algo 2 keys : (private & public)
	userProperty: "user", //not required, but this allows us to access jwt payload by req.user | user is payload
});

//After requireSignin middleware, user is signed in. We can pass data to user's profile with this middleware
exports.authMiddleware = (req, res, next) => {
	const userId = req.user._id; //we can use req.user here because in the requiresign in, we can use "user" as userproperty
	User.findById({ _id: userId }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User was not found.",
			});
		}
		req.profile = user;
		next();
	});
};

//Middleware to access admin data only after sign in. Refer to user.js/routes to see process
exports.adminMiddleware = (req, res, next) => {
	const adminId = req.user._id;
	User.findById({ _id: adminId }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User was not found.",
			});
		}

		if (user.role !== 0) {
			return res.status(400).json({
				error: "Admin only. Access denied.",
			});
		}

		req.profile = user; //setting a new variable to the user data to be able to use.
		next();
	});
};

exports.filterUser = (req, res, next) => {
	const userId = req.user._id;

	User.findById({ _id: userId }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User was not found.",
			});
		}

		req.profile = user; //setting a new variable to the user data to be able to use.

		next();
	});
};

exports.canUpdateDelete = (req, res, next) => {
	const slug = req.params.slug.toLowerCase();
	const userId = req.profile._id.toString(); //from requireSignIn middleware
	let blogUserId = "";

	Blog.findOne({ slug }, (err, blog) => {
		console.log(blog);
		if (err) {
			return res.status(400).json({
				error: "Could not find blog to update.",
			});
		}
		blogUserId = blog.postedBy.toString();

		console.log(blogUserId, userId);

		if (userId !== blogUserId) {
			return res.status(400).json({
				error: "Blog can only be updated/deleted by Author.",
			});
		}
		next();
	});
};

exports.forgotPassword = (req, res) => {
	const { email } = req.body;
	console.log(email);

	User.findOne({ email }, function (err, user) {
		console.log(err, user);
		if (err || !user) {
			console.log("foo");
			return res.status(401).json({
				error: "User was not found. Please enter a valid email.",
			});
		}

		const token = jwt.sign(
			{ name: user.name },
			process.env.JWT_FORGOTPASSWORD_SECRET,
			{ expiresIn: "10m" }
		);

		console.log(token);

		const msg = {
			to: email, //admin email
			from: process.env.EMAIL_FROM,
			subject: "Password reset link.",
			html: `
				<h4>Please use the following link to reset your password. Link is available for 10 minutes.</h4>
				<a href=${process.env.CLIENT_URL}/auth/resetpassword/${token}>Reset your password here.</a>`,
		};

		return User.findByIdAndUpdate(
			user._id,
			{ resetPasswordLink: token },
			{ new: true },
			(err, result) => {
				if (err) {
					return res.json({
						error: `Error on server side to save token to reset password. Please try again. Error: ${err}`,
					});
				} else {
					console.log("foo foo");
					return (async () => {
						try {
							await sgMail.send(msg).then((sent) => {
								res.status(202).json({
									message: `Reset password link has been sent to your email ${email}. Link is valid for 10 minutes.`,
								});
							});
						} catch (err) {
							return res.status(400).json({
								error: `error sending reset password link ${err}`,
							});
						}
					})();
				}
			}
		);
	});
};

exports.resetPassword = (req, res) => {
	const { resetPasswordLink, newPassword } = req.body;

	if (resetPasswordLink) {
		jwt.verify(
			resetPasswordLink,
			process.env.JWT_FORGOTPASSWORD_SECRET,
			(err, decoded) => {
				if (err) {
					return res.status(400).json({
						error: `Expired Link. Please try again.`,
					});
				}

				User.findOne({ resetPasswordLink }, (err, user) => {
					if (err || !user) {
						return res.status(401).json({
							error: `Something went wrong. Please try again later. Error: ${err}`,
						});
					}

					const updatedData = {
						password: newPassword,
						resetPasswordLink: "",
					};

					user = _.extend(user, updatedData);

					user.save((err, savedUser) => {
						if (err) {
							return res.status(400).json({
								error: `Problem saving new password. Please try again. Database error: ${err}`,
							});
						}
						res.json({
							message:
								"Password reset confirmed. You can now login with your new password.",
						});
					});
				});
			}
		);
	} else {
		return res.status(400).json({
			error: `Invalid session, please try again.`,
		});
	}
	//
};

const client = new OAuth2Client(process.env.GOOGLE_LOGIN_ID);
exports.googleLogin = (req, res) => {
	const idToken = req.body.tokenId;
	client
		.verifyIdToken({ idToken, audience: process.env.GOOGLE_LOGIN_ID })
		.then((response) => {
			console.log(response);
			const { email_verified, name, email, jti } = response.payload;
			console.log(email);

			if (email_verified) {
				User.findOne({ email }, (err, user) => {
					if (user) {
						console.log(user);
						const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
							expiresIn: "1d",
						});
						res.cookie("token", token, { expiresIn: "1d" });
						const { _id, name, email, role, username } = user;
						return res.json({
							token,
							user: { _id, name, email, role, username },
						});
					} else {
						console.log("no user found");
						let username = nanoid();
						let profile = `${process.env.CLIENT_URL}/profile/${username}`;
						let password = jti;

						user = new User({ name, email, profile, username, password });

						user.save((err, data) => {
							if (err) {
								return res.status(400).json({
									error: `Problem saving new user. Please try again.`,
								});
							}
							const token = jwt.sign(
								{ _id: data._id },
								process.env.JWT_SECRET,
								{
									expiresIn: "1d",
								}
							);
							res.cookie("token", token, { expiresIn: "1d" });
							const { _id, name, email, role, username } = data;
							return res.json({
								token,
								user: { _id, name, email, role, username },
							});
						});
					}
				});
			} else {
				return res.status(400).json({
					error: `Google login failed, please try again.`,
				});
			}
		});
};

const User = require("../models/user");
const Blog = require("../models/blog");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

//for authMiddleware & adminMiddleware, when set req.profile = user, all data is there, so we can create new middleware to remove hashed pw and salt
exports.read = (req, res, next) => {
	req.profile.hashed_password = undefined;
	// req.profile.salt = undefined;
	return res.json({
		user: req.profile,
	});
};

exports.listUserBlogs = (req, res) => {
	let username = req.params.username;

	User.find({ username }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: `Problem locating selected User in backend to list user's blogs: ${err}`,
			});
		}
		let userId = user[0]._id;

		Blog.find({ postedBy: userId })
			.populate("categories", "_id name slug")
			.populate("tags", "_id name slug")
			.populate("postedBy", "_id name username")
			.limit(10)
			.select(
				"_id title slug excerpt mtitle mdesc postedBy tags categories createdAt updatedAt"
			)
			.exec((err, blogs) => {
				if (err | !blogs) {
					return res.status(400).json({
						error: err
							? `Error: ${err}`
							: "Could not find any blogs for this user",
					});
				}
				// user.photo = undefined;
				res.json({
					user,
					blogs,
				});
			});
	});
};

exports.update = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: `Error parsing form: ${err}`,
			});
		}

		let user = req.profile; //available from authMiddleware

		let copyUser = _.cloneDeep(user);

		console.log('foo')
		console.log(fields, files)

		user = _.merge(user, fields);
		user.photo.data = copyUser.photo.data
		user.photo.contentType = copyUser.photo.contentType

		if (fields.password && fields.password.length < 6) {
			return res.status(400).json({
				error: "Password should be at least 6 characters long.",
			});
		}

		if (files.photo) {
			if (files.photo.size > 1000000) {
				return res.status(400).json({
					error: `Image should be smaller than 1mb`,
				});
			}
			user.photo.data = fs.readFileSync(files.photo.path);
			user.photo.contentType = files.photo.type;
		}

		console.log('bar')
		console.log(user);


		user.save((err, result) => {
			console.log('bar')
			console.log(result)
			if (err) {
				return res.status(400).json(`newUser save error: ${err}`);
			}
			result.photo = undefined;
			result.email = undefined;
			result.hashed_password = undefined;
			result.salt = undefined;
			res.json(result);
		});
	});
};

exports.photo = (req, res) => {
	let _id = req.params.id;

	User.findOne({ _id }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: `Problem finding user's photo: ${err}`,
			});
		}
		if (user.photo.data) {
			res.set("Content-Type", user.photo.contentType);
			return res.send(user.photo.data);
		}
	});
};

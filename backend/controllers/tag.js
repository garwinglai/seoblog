const Tag = require("../models/tag");
const Blog = require("../models/blog");
const slugify = require("slugify");

exports.create = (req, res) => {
	const { name } = req.body;

	let slug = slugify(name).toLowerCase();

	const tag = new Tag({ name, slug });

	tag.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: "Tag already exists",
			});
		}

		res.json(data);
	});
};

exports.listAll = (req, res) => {
	Tag.find({}, (err, tags) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json(tags);
	});
};

exports.listOne = (req, res) => {
	let slug = req.params.slug.toLowerCase();

	Tag.findOne({ slug }, (err, tag) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		Blog.find({ tags: tag })
			.populate("categories", "_id name slug")
			.populate("tags", "_id name slug")
			.populate("postedBy", "_id name role")
			.select("_id title categories tags slug excerpt postedBy createdAt updatedAt mdesc")
			.exec((err, blogs) => {
				if (err) {
					return console.log(
						`finding related blogs with tag mongoose error: ${err}`
					);
				}
				console.log(blogs)
				res.json({ tag: tag, blogs: blogs });
			});

			
	});
};

exports.remove = (req, res) => {
	let slug = req.params.slug.toLowerCase();

	Tag.deleteOne({ slug }, (err, data) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}

		res.json({
			message: "Tag successfully deleted.",
		});
	});
};

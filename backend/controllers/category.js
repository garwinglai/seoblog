const Category = require("../models/category");
const Blog = require("../models/blog");
const slugify = require("slugify");

exports.create = (req, res) => {
	const { name } = req.body;

	let slug = slugify(name).toLowerCase();

	let category = new Category({
		name,
		slug,
	});

	category.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: "Category already exists",
			});
		}

		res.json(data);
	});
};

//might have to adjust err object
exports.listAll = (req, res) => {
	Category.find({}, (err, data) => {
		if (err) {
			return res.status(400).json({
				error: "Could not find the list of data.",
			});
		}
		res.json(data);
	});
};

exports.listOne = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	Category.findOne({ slug }, (err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Could not fetch single data",
			});
		}
		Blog.find({ categories: category })
			.populate("categories", "_id name slug")
			.populate("tags", "_id name slug")
			.populate("postedBy", "_id name role")
			.select('_id title slug excerpt mdesc postedBy categories tags createdAt updatedAt profile')
			.exec((err, blog) => {
				if (err) {
					return res.status(400).json({
						error: "Could not fetch single data of blog/category",
					});
				}
				console.log(blog)
				res.json({ category: category, blogs: blog });
			});
	});
};

exports.remove = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	Category.findOneAndRemove({ slug }, (err, data) => {
		if (err) {
			return res.status(400).json({
				error: "Could not delete category.",
			});
		}
		res.json(data);
	});
};

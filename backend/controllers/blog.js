const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const fs = require("fs");
const { excerptTrim } = require("../helpers/blog");

exports.create = (req, res) => {
	let form = formidable.IncomingForm();

	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Image could not upload",
				err: err,
			});
		}

		const { title, body, categories, tags } = fields;

		if (!title || !title.length) {
			return res.status(400).json({
				error: "Title is required.",
			});
		}

		if (!body || body.length < 200) {
			return res.status(400).json({
				error: "Content is too short.",
			});
		}

		if (!categories || categories.length === 0) {
			return res.status(400).json({
				error: "Please select at least one category.",
			});
		}

		if (!tags || tags.length === 0) {
			return res.status(400).json({
				error: "Please select at least one tag.",
			});
		}

		let blog = new Blog({
			title,
			body,
			excerpt: excerptTrim(body, 320),
			slug: slugify(title).toLowerCase(),
			mtitle: `${title} | ${process.env.APP_NAME}`,
			mdesc: stripHtml(body.substring(0, 160)).result,
			postedBy: req.user._id,
		});

		//categories and tags
		let arrCategories = categories.split(",");
		let arrTags = tags.split(",");

		if (!files.photo) {
			return res.status(400).json({
				error: "Please select at least one image.",
			});
		} else {
			console.log(`files photo: ${files.photo}`);
			if (files.photo.size > 10000000) {
				return res.status(400).json({
					error: "Image should be less than 1mb in size",
				});
			}
			blog.photo.data = fs.readFileSync(files.photo.path);
			blog.photo.contentType = files.photo.type;
		}

		blog.save((err, result) => {
			if (err) {
				return res.status(400).json(err);
			}
			Blog.findByIdAndUpdate(
				result._id,
				{ $push: { categories: arrCategories } },
				{ new: true },
				(error, updatedCategories) => {
					if (error) {
						return res.status(400).json(error);
					} else {
						Blog.findByIdAndUpdate(
							result._id,
							{ $push: { tags: arrTags } },
							{ new: true },
							(e, updatedCategoriesAndTags) => {
								if (e) {
									return res.status(400).json(e);
								}
								res.json(updatedCategoriesAndTags);
							}
						);
					}
				}
			);
		});
	});
};

exports.listAll = (req, res) => {
	const postedBy = req.profile._id;

	Blog.find({ postedBy })
		// .select("-photo")
		.populate("categories", "_id name slug")
		.populate("tags", "_id name slug")
		.populate("postedBy", "_id name username")
		.select(
			"_id title slug excerpt categories tags postedBy createdAt updatedAt"
		)
		.exec((err, data) => {
			if (err) {
				return res.json({
					error: `listAll blogs error: ${err}`,
				});
			} else {
				res.json(data);
			}
		});
};

//listAll, listAllBlogsCategoriesTags, listOne, remove, update

exports.listAllBlogsCategoriesTags = (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 10; //we can get this from frontend, the user can enter the limit
	let skip = req.body.skip ? parseInt(req.body.skip) : 0; //this will also send fromt he client side

	console.log(limit, skip, req.body);

	let blogs;
	let categories;
	let tags;

	Blog.find({})
		.populate("categories", "_id name slug")
		.populate("tags", "_id name slug")
		.populate("postedBy", "_id name username profile")
		.sort({ createdAt: -1 }) //-1 is desc in mongoose
		.skip(skip)
		.limit(limit)
		.select(
			"_id title slug excerpt categories tags postedBy createdAt updatedAt"
		)
		.exec((err, data) => {
			if (err) {
				return res.json({
					error: `listAll blogs post error: ${err}`,
				});
			}
			blogs = data; //blogs

			Category.find({}).exec((err, c) => {
				if (err) {
					return res.json({
						error: `listAll categories post error: ${err}`,
					});
				}

				categories = c;

				Tag.find({}).exec((err, t) => {
					if (err) {
						return res.json({
							error: `listAll tags post error: ${err}`,
						});
					}

					tags = t;

					//return all
					res.json({ blogs, categories, tags, size: blogs.length });
				});
			});
		});
};

exports.listOne = (req, res) => {
	let slug = req.params.slug.toLowerCase();

	Blog.findOne({ slug })
		.populate("categories", "_id name slug")
		.populate("tags", "_id name slug")
		.populate("postedBy", "_id name username")
		.select(
			"_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
		)
		.exec((err, data) => {
			if (err) {
				return res.json({
					error: `listOne tags post error: ${err}`,
				});
			}
			res.json(data);
		});
};

exports.remove = (req, res) => {
	let slug = req.params.slug.toLowerCase();

	Blog.findOneAndRemove({ slug }, (err, data) => {
		if (err) {
			return res.json({
				error: `removing blog error: ${err}`,
			});
		}
		res.json({
			message: "Blog has been deleted successfully.",
		});
	});
};

exports.update = (req, res) => {
	let slug = req.params.slug.toLowerCase();

	Blog.findOne({ slug }, (err, oldBlog) => {
		if (err) {
			return res.json({
				error: `error finding the blog to update: ${err}`,
			});
		}

		let form = formidable.IncomingForm();
		form.keepExtensions = true;

		form.parse(req, (err, fields, files) => {
			if (err) {
				return res.status(400).json({
					error: "Image could not upload",
					err: err,
				});
			}

			let copyOldBlog = _.cloneDeep(oldBlog);
			
			console.log({fields, files})

			let slugPrevious = oldBlog.slug;
			oldBlog = _.merge(oldBlog, fields);
			oldBlog.slug = slugPrevious;
			oldBlog.photo.data = copyOldBlog.photo.data;
			oldBlog.photo.contentType = copyOldBlog.photo.contentType;

			const { body, title, mdesc, categories, tags } = fields;

			if (body) {
				oldBlog.excerpt = excerptTrim(body, 320);
				oldBlog.mdesc = stripHtml(body.substring(0, 160)).result;
			}

			if (categories) {
				oldBlog.categories = categories.split(",");
			}

			if (tags) {
				oldBlog.tags = tags.split(",");
			}

			if (files.photo) {
				if (files.photo.size > 10000000) {
					return res.status(400).json({
						error: "Image should be less than 1mb in size",
					});
				}
				oldBlog.photo.data = fs.readFileSync(files.photo.path);
				oldBlog.photo.contentType = files.photo.type;
			}
	

			oldBlog.save((err, result) => {
				if (err) {
					return res.status(400).json(`oldBlog save error: ${err}`);
				}
				result.photo = undefined;
				res.json(result);
			});
		});
	});
};

exports.photo = (req, res) => {
	let slug = req.params.slug.toLowerCase();
	console.log("foo");
	console.log(slug);

	Blog.findOne({ slug }, (err, blog) => {
		if (err || !blog) {
			return res.status(400).json({
				error: `Error finding photo error: ${err}`,
			});
		}

		res.set("Content-Type", blog.photo.contentType);
		return res.send(blog.photo.data);
	});
};

exports.listRelated = (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 3;
	const { _id, categories } = req.body.blog;

	Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
		.limit(limit)
		.populate("postedBy", "_id name profile username")
		.select("title slug excerpt postedBy createdAt updatedAt")
		.exec((err, blogs) => {
			if (err) {
				return res.status(400).json({
					error: `Related blogs not found error: ${err}`,
				});
			}
			res.json(blogs);
		});
};

exports.searchResult = async (req, res) => {
	console.log("foo bar");
	const { search } = req.query;
	console.log(search);

	if (search) {
		await Blog.find(
			{
				$or: [
					{ title: { $regex: search, $options: "i" } },
					{ body: { $regex: search, $options: "i" } },
				],
			},
			(err, blogs) => {
				if (err) {
					return res.status(400).json({
						error: `error searching blogs backend ${err}`,
					});
				}
				res.json(blogs);
			}
		).select("-photo -body");
	}
};

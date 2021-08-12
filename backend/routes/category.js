const express = require("express");
const router = express.Router();
const {
	requireSignIn,
	authMiddleware,
	adminMiddleware,
} = require("../controllers/auth");
const { createCategoryValidator } = require("../validators/category");
const { runValidator } = require("../validators/index");
const { create, listAll, listOne, remove } = require("../controllers/category");

//post, getall, getone, delete. Not using update b/c if category already indexed with Google, updating it will hurt SEO
router.post(
	"/category",
	createCategoryValidator,
	runValidator,
	requireSignIn,
	adminMiddleware,
	create
);
router.get("/categories", listAll);
router.get("/category/:slug", listOne);
router.delete("/category/:slug", requireSignIn, adminMiddleware, remove);

module.exports = router;

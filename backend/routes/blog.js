const express = require("express");
const router = express.Router();
const {
	create,
	listAll,
	listAllBlogsCategoriesTags,
	listOne,
	remove,
	update,
	photo,
	listRelated,
	searchResult,
} = require("../controllers/blog");
const {
	requireSignIn,
	adminMiddleware,
	authMiddleware,
	filterUser,
	canUpdateDelete,
} = require("../controllers/auth");

//By User
router.get("/blogs", requireSignIn, filterUser, listAll);

//Admin
router.post("/blog", requireSignIn, adminMiddleware, create);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", listOne);
router.delete(
	"/blog/:slug",
	requireSignIn,
	adminMiddleware,
	canUpdateDelete,
	remove
);
router.put(
	"/blog/:slug",
	requireSignIn,
	adminMiddleware,
	canUpdateDelete,
	update
);
router.get("/blog/photo/:slug", photo);
router.post("/blog/related", listRelated);
router.get("/blogs/search", searchResult);

//Auth User
router.post("/user/blog", requireSignIn, authMiddleware, create);
router.put(
	"/user/blog/:slug",
	requireSignIn,
	authMiddleware,
	canUpdateDelete,
	update
);
router.delete(
	"/user/blog/:slug",
	requireSignIn,
	authMiddleware,
	canUpdateDelete,
	remove
);

module.exports = router;

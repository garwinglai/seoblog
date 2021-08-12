const express = require("express");
const router = express.Router();
const {
	requireSignIn,
	authMiddleware,
	adminMiddleware,
} = require("../controllers/auth");
const { read, listUserBlogs, update, photo } = require("../controllers/user");

router.get("/profile", requireSignIn, authMiddleware, read);
router.get("/profile/:username", listUserBlogs);
router.put("/profile/update", requireSignIn, authMiddleware, update);
router.get("/profile/photo/:id", photo);

module.exports = router;

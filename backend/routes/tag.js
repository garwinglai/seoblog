const express = require("express");
const router = express.Router();
const { createTagValidator } = require("../validators/tag");
const { requireSignIn, adminMiddleware } = require("../controllers/auth");
const { runValidator } = require("../validators/index");
const { create, listAll, listOne, remove } = require("../controllers/tag");

router.post(
	"/tag",
	createTagValidator,
	runValidator,
	requireSignIn,
	adminMiddleware,
	create
);
router.get("/tags", listAll);
router.get("/tag/:slug", listOne);
router.delete("/tag/:slug", requireSignIn, adminMiddleware, remove);


module.exports = router;

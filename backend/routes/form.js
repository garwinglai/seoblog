const express = require("express");
const router = express.Router();
const { formValidator } = require("../validators/form");
const { runValidator } = require("../validators/index");
const { contactForm, contactFormBlogAuthor } = require("../controllers/form");

router.post("/contact", formValidator, runValidator, contactForm);
router.post("/contact-blog-author", formValidator, runValidator, contactFormBlogAuthor);

module.exports = router;

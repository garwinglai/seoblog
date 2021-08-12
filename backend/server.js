const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
// deprecated || const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

//bring routes
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const tagRoutes = require("./routes/tag");
const formSubmitRoutes = require("./routes/form");

//app
const app = express();

//db
mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(console.log("DB connected"));

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//cors      || cors in dev only because api and client are on diff origin/domain, in production, don't need cors unless want to share api
if (process.env.NODE_ENV === "development") {
	app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//routes middleware
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formSubmitRoutes);

//port
const port = process.env.PORT || 8000;

app.listen(port, (req, res) => {
	console.log(`Server is running on port ${port}`);
});

const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			required: true,
			max: 32,
			unique: true,
			index: true,
			losercase: true,
		},
		name: {
			type: String,
			trim: true,
			required: true,
			max: 32,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			max: 32,
			unique: true,
			lowercase: true,
		},
		profile: {
			type: String,
			required: true,
		},
		hashed_password: {
			type: String,
			required: true,
		},
		salt: String,
		about: {
			type: String,
		},
		role: {
			type: Number,
			default: 0,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		resetPasswordLink: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

userSchema
	.virtual("password")
	.set(function (password) {
		//create temporary password called _password
		this._password = password;
		//create salt
		this.salt = crypto.randomBytes(16).toString("hex");
		//create encryption
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

userSchema.methods = {
	authenticate: function (plainPassword) {
		return this.encryptPassword(plainPassword) === this.hashed_password;
	},

	encryptPassword: function (password) {
		if (!password) return "";
		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(password)
				.digest("hex");
		} catch (err) {
			console.log(err);
			return "";
		}
	},
};

module.exports = mongoose.model("User", userSchema);

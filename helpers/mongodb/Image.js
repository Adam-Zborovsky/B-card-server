const { mongoose } = require("mongoose");
const { URL, DEFAULT_VALIDATION } = require("./mongooseValidators");

const Image = new mongoose.Schema({
	url: URL,
	alt: {
		type: String,
		trim: true,
		lowercase: true,
	},
});

module.exports = Image;

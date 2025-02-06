const { generateAuthToken } = require("../../auth/providers/jwt");
const { createError } = require("../../utils/handleErrors");
const { generatePassword, comparePasswords } = require("../helpers/bcrypt");
const User = require("./mongodb/User");

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 60 * 60 * 1000;

const loginUser = async (email, password) => {
	try {
		const userFromBD = await User.findOne({ email });
		if (!userFromBD) {
			const error = new Error("User not exsist. Please register");
			error.status = 401;
			createError("Authentication", error);
		}
		if (!comparePasswords(password, userFromBD.password)) {
			const error = Error("Password Mismatch");
			error.status = 401;
			createError("Authentication", error);
		}
		const token = generateAuthToken(userFromBD);
		return token;
	} catch (error) {
		createError("Mongoose", error);
	}
};

const registerUser = async (newUser) => {
	try {
		newUser.password = generatePassword(newUser.password);
		let user = new User(newUser);
		user = await user.save();
		user = { email: user.email, name: user.name, _id: user._id };
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const getUser = async (query = {}) => {
	try {
		let user = await User.find(query).select("-password");
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const updateUserInfo = async (userId, newUserInfo) => {
	try {
		let user = await User.findByIdAndUpdate(userId, newUserInfo, {
			new: true,
		});

		user = await user.save();
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const deleteUser = async (userId) => {
	try {
		let user = await User.findByIdAndDelete(userId);
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const patchUser = async (userId) => {
	try {
		let user = await User.findById(userId);
		if (!user) throw new Error("User not found");

		user.isBusiness = !user.isBusiness;

		user = await user.save();
		return user;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const checkLoginAttempts = async (email) => {
	const user = await User.findOne({ email });
	if (!user) return null;

	if (user.blockedUntil && user.blockedUntil > Date.now()) {
		const error = new Error(
			"User is blocked due to multiple failed login attempts"
		);
		error.status = 403;
		throw error;
	}

	return user;
};

const recordFailedLogin = async (email) => {
	const user = await User.findOne({ email });
	if (!user) return;

	user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
	if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
		user.blockedUntil = Date.now() + BLOCK_DURATION;
		user.failedLoginAttempts = 0; // Reset attempts after blocking
	}
	await user.save();
};

module.exports = {
	registerUser,
	getUser,
	loginUser,
	updateUserInfo,
	deleteUser,
	patchUser,
	checkLoginAttempts,
	recordFailedLogin,
};

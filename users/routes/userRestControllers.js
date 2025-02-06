const express = require("express");
const {
	registerUser,
	getUser,
	loginUser,
	updateUserInfo,
	deleteUser,
	patchUser,
	checkLoginAttempts,
	recordFailedLogin,
} = require("../models/userAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const {
	validateRegistration,
	validateLogin,
} = require("../validation/userValidationService");
const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		const validateErrorMessage = validateLogin(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation" + validateErrorMessage);
		}
		let { email, password } = req.body;
		const user = await checkLoginAttempts(email);

		if (!user || !user.comparePassword(password)) {
			await recordFailedLogin(email);
			return handleError(res, 401, "Invalid email or password");
		}

		user.failedLoginAttempts = 0;
		await user.save();

		const token = await loginUser(email, password);
		res.status(202).send(token);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.post("/", async (req, res) => {
	try {
		const validateErrorMessage = validateRegistration(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation" + validateErrorMessage);
		}
		let user = await registerUser(req.body);
		res.status(201).send(user);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.get("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		let { id } = req.params;

		if (userInfo._id != id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can get user info"
				);
		}

		let user = await getUser({ _id: id });
		res.status(200).send(user);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.get("/", auth, async (req, res) => {
	try {
		let user = await getUser();
		res.status(200).send(user);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.put("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		const newUserInfo = req.body;

		let { id } = req.params;

		if (userInfo._id != id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can update user info"
				);
		}

		let updatedUser = await updateUserInfo(id, newUserInfo);
		res.status(202).send(updatedUser);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.delete("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		let { id } = req.params;

		if (userInfo._id != id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can delete user"
				);
		}

		let deletedUser = await deleteUser(id);

		res.status(202).send(deletedUser);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.patch("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		const { id } = req.params;

		if (userInfo._id != id && !userInfo.isAdmin) {
			return res
				.status(403)
				.send(
					"Authorization Error: Only the same user or admin can delete user"
				);
		}

		let patchedUser = await patchUser(id);

		res.status(200).send(patchedUser);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

module.exports = router;

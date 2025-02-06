const express = require("express");
const {
	createCard,
	getCards,
	updateCard,
	likeCard,
	deleteCard,
	updateBizNumber,
} = require("../models/cardAccessDataService");
const auth = require("../../auth/authService");
const { normalizeCard } = require("../helpers/normalize");
const { handleError } = require("../../utils/handleErrors");
const validateCard = require("../validation/cardValidationService");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		let cards = await getCards();
		res.status(200).send(cards);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.get("/my-cards", auth, async (req, res) => {
	console.log(req.user);

	try {
		const userInfo = req.user;
		console.log(userInfo);
		if (!userInfo.isBusiness) {
			return handleError(res, 403, "Only business users can get my cards");
		}
		let cards = await getCards({ user_id: userInfo._id });
		res.status(200).send(cards);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		let card = await getCards({ _id: id });
		res.status(200).send(card);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.post("/", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		if (!userInfo.isBusiness) {
			return handleError(res, 403, "Only business users can create new card");
		}
		const validateErrorMessage = validateCard(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation" + validateErrorMessage);
		}
		let card = await normalizeCard(req.body, userInfo._id);
		card = await createCard(card);
		res.status(201).send(card);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.put("/:id", auth, async (req, res) => {
	try {
		const userInfo = req.user;
		const newCard = req.body;
		const { id } = req.params;
		const originalCard = await getCards({ _id: id });

		if (userInfo._id != originalCard[0].user_id && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only the user who created the business card or admin can update its details"
			);
		}
		const validateErrorMessage = validateCard(req.body);
		if (validateErrorMessage !== "") {
			return handleError(res, 400, "Validation" + validateErrorMessage);
		}
		let card = await normalizeCard(newCard, userInfo._id);
		card = await updateCard(id, card);
		res.status(202).send(card);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.patch("/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const userInfo = req.user;

		if (req.body) {
			if (!userInfo.isAdmin) {
				return handleError(res, 403, "Only admin can update business number");
			}

			const { bizNumber } = req.body;
			const card = await updateBizNumber(id, { bizNumber: bizNumber });
			return res.status(200).send(card);
		} else {
			const userId = userInfo._id;
			const card = await likeCard(id, userId);
			return res.status(200).send(card);
		}
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});

router.delete("/:id", auth, async (req, res) => {
	try {
		let { id } = req.params;
		const userInfo = req.user;
		const originalCard = await getCards({ _id: id });

		if (userInfo._id != originalCard[0].user_id && !userInfo.isAdmin) {
			return handleError(
				res,
				403,
				"Only the user who created the business card or admin can update its details"
			);
		}
		let card = await deleteCard(id);
		res.status(202).send(card);
	} catch (error) {
		handleError(res, error.status || 400, error.message);
	}
});
module.exports = router;

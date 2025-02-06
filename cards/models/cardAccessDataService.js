const { createError } = require("../../utils/handleErrors");
const Card = require("./mongodb/Card");

const getCards = async (query = {}) => {
	try {
		let cards = await Card.find(query);
		return cards;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const createCard = async (newCard) => {
	try {
		let card = new Card(newCard);
		card = await card.save();
		return card;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const updateCard = async (cardId, newCard) => {
	try {
		let card = await Card.findByIdAndUpdate(cardId, newCard, { new: true });
		return card;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const likeCard = async (cardId, userId) => {
	try {
		let card = await Card.findById(cardId);
		if (!card) {
			const error = new Error("Card ID cannot found in the DataBase");
			error.status = 404;
			return createError("Mongoose", error);
		}

		if (card.likes.includes(userId)) {
			let newLikesArray = card.likes.filter((id) => id != userId);
			card.likes = newLikesArray;
		} else {
			card.likes.push(userId);
		}
		await card.save();
		return card;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const deleteCard = async (cardId) => {
	try {
		let card = await Card.findByIdAndDelete(cardId);
		return card;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

const updateBizNumber = async (cardId, bizNumber) => {
	try {
		// Check if the bizNumber is already taken
		const existingCard = await Card.findOne({ bizNumber });
		if (existingCard) {
			const error = new Error("Business number already in use");
			error.status = 409; // Conflict
			throw error;
		}

		let card = await Card.findByIdAndUpdate(
			cardId,
			{ bizNumber },
			{ new: true }
		);
		return card;
	} catch (error) {
		return createError("Mongoose", error);
	}
};

module.exports = {
	getCards,
	createCard,
	updateCard,
	likeCard,
	deleteCard,
	updateBizNumber,
};

const _ = require("lodash");
const Card = require("../models/mongodb/Card");
const { createError } = require("../../utils/handleErrors");

const generateBizNum = async () => {
  let cardCount = await Card.countDocuments();
  if (cardCount === 8_999_999) {
    const error = new Error("You reched to maximum cards count in your system");
    error.status = 507;
    return createError("mongoose", error);
  }
  let random;
  do {
    random = _.random(1_000_000, 9_999_999);
  } while (await checkBizNumberExsist(random));

  return random;
};

const checkBizNumberExsist = async (bizNumber) => {
  try {
    const bizNumberExsist = await Card.findOne({ bizNumber });
    return Boolean(bizNumberExsist);
  } catch (error) {
    error.status = 500;
    return createError("mongoose", error);
  }
};

module.exports = { generateBizNum };

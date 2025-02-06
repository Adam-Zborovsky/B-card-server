const express = require("express");
const router = express.Router();
const cardsRouterController = require("../cards/routes/cardRestControllers");
const userRouterController = require("../users/routes/userRestControllers");
const { handleError } = require("../utils/handleErrors");

router.use("/cards", cardsRouterController);
router.use("/users", userRouterController);
router.use((req, res) => {
  handleError(res, 404, "Path not found");
});

module.exports = router;

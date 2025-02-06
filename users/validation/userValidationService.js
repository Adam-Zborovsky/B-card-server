const loginValidation = require("./joi/loginValidation");
const registerValidation = require("./joi/registerValidation");
const config = require("config");

// const validator = "Joi";
const validator = config.get("VALIDATOR");

const validateRegistration = (user) => {
  if (validator === "Joi") {
    const { error } = registerValidation(user);
    if (error) return error.details[0].message;
    return "";
  }
};

const validateLogin = (user) => {
  if (validator === "Joi") {
    const { error } = loginValidation(user);
    if (error) return error.details[0].message;
    return "";
  }
};

module.exports = { validateLogin, validateRegistration };

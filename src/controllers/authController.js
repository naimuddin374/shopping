const bcrypt = require("bcrypt");
const { User } = require("../models");
const validator = require("../validators");
const {
  validationError,
  serverError,
  createdSuccess,
  badRequest,
  actionSuccess,
  tokenGenerator,
} = require("../utils");

// LOGIN
exports.login = async (req, res) => {
  let { email, password } = req.body;

  // CHECK VALIDATION
  const formField = {
    email: email,
    password: password,
  };
  const validate = validator(formField);
  if (!validate.isValid) {
    return validationError(res, validate.error);
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return badRequest(res, null, "Invalid credentials!");
    }

    let compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return badRequest(res, null, "Invalid credentials!");
    }

    if (user.status !== 1) {
      return badRequest(
        res,
        null,
        "Your account has been blocked, please contact our support!"
      );
    }
    const token = await tokenGenerator(user);
    return actionSuccess(res, token, "Login Successful!");
  } catch (error) {
    return serverError(res, error);
  }
};

// USER REGISTER
exports.register = async (req, res) => {
  console.log("OOOOOOOOOOOOOO");

  let { firstName, lastName, email, password, contact } = req.body;

  // CHECK VALIDATION
  const formField = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    contact: contact,
  };
  const validate = validator(formField);
  if (!validate.isValid) {
    return validationError(res, validate.error);
  }

  try {
    // CHECK EMAIL UNIQUE
    let findData = await User.findOne({ email });
    if (findData) {
      return badRequest(res, null, "Email address already exist!");
    }

    // GENERATE PASSWORD HASH KEY
    let hash = await bcrypt.hash(password, 11);
    formField.password = hash;

    // SAVE DATA
    let schema = new User(formField);
    let result = await schema.save();
    return createdSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

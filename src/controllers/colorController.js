const { Color } = require("../models");
const validator = require("../validators");
const {
  validationError,
  serverError,
  createdSuccess,
  badRequest,
  actionSuccess,
  updatedSuccess,
  deleteSuccess,
} = require("../utils");
const { getQueryParams } = require("../utils/query-params");

// GET LIST
exports.list = async (req, res) => {
  const query = {};
  const { page, limit, keyword } = getQueryParams(req);
  try {
    // You can add filters to your query if needed
    if (keyword) {
      query.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    /** Data pull from database */
    const data = await Color.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocument = await Color.countDocuments(query);

    const response = {
      data,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limit),
      currentPage: page,
    };
    return actionSuccess(res, response);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    let result = await Color.findById(req.params.id);
    return actionSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// INSERT
exports.insert = async (req, res) => {
  let { name } = req.body;

  // CHECK VALIDATION
  const formField = {
    name: name,
  };
  const validate = validator(formField);
  if (!validate.isValid) {
    return validationError(res, validate.error);
  }

  try {
    // CHECK UNIQUE
    let findData = await Color.findOne({ name });
    if (findData) {
      return badRequest(res, null, "Content already exists!");
    }

    // SAVE DATA
    let schema = new Color(formField);
    let result = await schema.save();
    return createdSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// UPDATE
exports.update = async (req, res) => {
  let { name } = req.body;

  // CHECK VALIDATION
  const formField = {
    name: name,
  };
  const validate = validator(formField);
  if (!validate.isValid) {
    return validationError(res, validate.error);
  }

  try {
    // CHECK ID
    let findData = await Color.findById(req.params.id);
    if (!findData) {
      return badRequest(res, null, "Content Not Found!");
    }

    // UPDATE DATA
    let result = await Color.findByIdAndUpdate(
      req.params.id,
      { $set: formField },
      { new: true, useFindAndModify: false }
    );
    return updatedSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    // CHECK ID
    let findData = await Color.findById(req.params.id);
    if (!findData) {
      return badRequest(res, null, "Content Not Found!");
    }

    // UPDATE DATA
    let result = await Color.findByIdAndDelete(req.params.id);
    return deleteSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

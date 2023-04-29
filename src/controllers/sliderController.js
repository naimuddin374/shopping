const { Slider } = require("../models");
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
const fileUpload = require("../utils/fileUpload");

// GET LIST
exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const query = {};

    // You can add filters to your query if needed
    if (req.query.keyword) {
      query.$or = [{ name: { $regex: req.query.keyword, $options: "i" } }];
    }

    /** Data pull from database */
    const data = await Slider.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalDocument = await Slider.countDocuments(query);

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
    const result = await Slider.findById(req.params.id);
    return actionSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// INSERT
exports.insert = async (req, res, next) => {
  let { name, serial } = req.body;

  const uploadFile = await fileUpload.fileUploadHandler(req, res, next);

  try {
    // CHECK VALIDATION
    const formField = {
      name: name,
      serial: serial,
      image: uploadFile,
    };
    const validate = validator(formField);
    if (!validate.isValid) {
      return validationError(res, validate.error);
    }

    // CHECK UNIQUE
    let findData = await Slider.findOne({ name });
    if (findData) {
      return badRequest(res, null, "Content already exists!");
    }

    // SAVE DATA
    const schema = new Slider(formField);
    const result = await schema.save();
    return createdSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// UPDATE
exports.update = async (req, res, next) => {
  let { name, serial } = req.body;

  // CHECK VALIDATION
  const formField = {
    name: name,
    serial: serial,
  };
  const validate = validator(formField);
  if (!validate.isValid) {
    return validationError(res, validate.error);
  }

  try {
    // CHECK ID
    const findData = await Slider.findById(req.params.id);
    if (!findData) {
      return badRequest(res, null, "Content Not Found!");
    }

    // REMOVE AND UPLOAD NEW IMAGE
    const uploadFile = await fileUpload.fileUploadHandler(req, res, next);
    if (uploadFile) {
      formField.image = uploadFile;
      if (findData.image) {
        await fileUpload.fileDeleteHandler(findData.image);
      }
    }

    // UPDATE DATA
    const result = await Slider.findByIdAndUpdate(
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
    let findData = await Slider.findById(req.params.id);
    if (!findData) {
      return badRequest(res, null, "Content Not Found!");
    }

    // UPDATE DATA
    let result = await Slider.findByIdAndDelete(req.params.id);
    return deleteSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

const { Product, SubCategory } = require("../models");
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
const { objectIdIsValid } = require("../utils/helper");
const fileUpload = require("../utils/fileUpload");
const { getQueryParams } = require("../utils/query-params");

// GET LIST
exports.list = async (req, res) => {
  const query = {};
  const { page, limit, keyword } = getQueryParams(req);

  try {
    // You can add filters to your query if needed
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    /** Data pull from DB */
    const data = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("subcategory");
    const totalDocument = await Product.countDocuments(query);

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

// GET LIST OF BEST SELLING
exports.getBestSelling = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const query = {
      bestSelling: true,
    };

    // You can add filters to your query if needed
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Calculate the offset and limit based on the page size
    const offset = (page - 1) * limit;

    const result = await Product.find(query)
      .skip(offset)
      .limit(limit)
      .populate("subcategory");

    const totalDocument = await Product.countDocuments(query);

    const payload = {
      result,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limit),
      currentPage: page,
    };
    return actionSuccess(res, payload);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET LIST OF TRENDING
exports.getTrending = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const query = {
      trending: true,
    };

    // You can add filters to your query if needed
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Calculate the offset and limit based on the page size
    const offset = (page - 1) * limit;

    const result = await Product.find(query)
      .skip(offset)
      .limit(limit)
      .populate("subcategory");

    const totalDocument = await Product.countDocuments(query);

    const payload = {
      result,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limit),
      currentPage: page,
    };
    return actionSuccess(res, payload);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const result = await Product.findById(req.params.id).populate(
      "subcategory"
    );
    return actionSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET BY SUB CATEGORY ID
exports.getBySubCatId = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const query = {
      subcategory: req.params.id,
    };

    // You can add filters to your query if needed
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Calculate the offset and limit based on the page size
    const offset = (page - 1) * limit;

    const result = await Product.find(query)
      .skip(offset)
      .limit(limit)
      .populate("subcategory");

    const totalDocument = await Product.countDocuments(query);

    const payload = {
      result,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limit),
      currentPage: page,
    };
    return actionSuccess(res, payload);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET BY CATEGORY ID
exports.getByCatId = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const query = {
      subcategory: { category: req.params.id },
    };

    // You can add filters to your query if needed
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Calculate the offset and limit based on the page size
    const offset = (page - 1) * limit;

    const result = await Product.find(query)
      .skip(offset)
      .limit(limit)
      .populate("subcategory");

    const totalDocument = await Product.countDocuments(query);

    const payload = {
      result,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limit),
      currentPage: page,
    };
    return actionSuccess(res, payload);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET BY TITLE
exports.getBySearch = async (req, res) => {
  const title = req.query.title || "";
  const description = req.query.description || "";
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const query = {
      title: { $regex: title, $options: "i" },
      description: { $regex: description, $options: "i" },
    };

    // You can add filters to your query if needed
    // if (req.query.genre) {
    //     query.genre = req.query.genre;
    // }

    // Calculate the offset and limit based on the page size
    const offset = (page - 1) * limit;

    const result = await Product.find(query)
      .skip(offset)
      .limit(limit)
      .populate("subcategory");

    const totalDocument = await Product.countDocuments(query);

    const payload = {
      result,
      totalDocument,
      totalPages: Math.ceil(totalDocument / limit),
      currentPage: page,
    };
    return actionSuccess(res, payload);
  } catch (error) {
    return serverError(res, error);
  }
};

// INSERT
exports.insert = async (req, res, next) => {
  let {
    title,
    description,
    price,
    discount,
    subcategory,
    sizes,
    colors,
    bestSelling,
    trending,
  } = req.body;

  try {
    const uploadFile = await fileUpload.fileUploadHandler(req, res, next);

    if (!uploadFile) {
      return validationError(res, "The image field is required!");
    }

    // CHECK VALIDATION
    const formField = {
      title: title,
      description: description,
      price: price,
      discount: discount,
      subcategory: subcategory,
      image: uploadFile,
    };
    const validate = validator(formField);
    if (!validate.isValid) {
      return validationError(res, validate.error);
    }

    if (!objectIdIsValid(subcategory)) {
      return badRequest(res, null, "Invalid ID!");
    }

    // FIND SUB CATEGORY
    const findScat = await SubCategory.findById(subcategory);
    if (!findScat) {
      return badRequest(res, null, "Invalid subcategory!");
    }

    // CHECK UNIQUE
    const findData = await Product.findOne({ title, subcategory });
    if (findData) {
      return badRequest(res, null, "Content already exists!");
    }

    // SAVE DATA
    formField.sizes = sizes ? JSON.parse(sizes) : "";
    formField.colors = colors ? JSON.parse(colors) : "";
    formField.bestSelling = bestSelling;
    formField.trending = trending;
    const schema = new Product(formField);
    await schema.save();
    const result = await Product.findById(schema._id).populate("subcategory");
    return createdSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

// UPDATE
exports.update = async (req, res, next) => {
  let { title, description, price, discount, subcategory, sizes, colors } =
    req.body;

  // CHECK VALIDATION
  const formField = {
    title: title,
    description: description,
    price: price,
    discount: discount,
    subcategory: subcategory,
  };
  const validate = validator(formField);
  if (!validate.isValid) {
    return validationError(res, validate.error);
  }

  try {
    // CHECK ID
    const findData = await Product.findById(req.params.id);
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
    if (sizes) {
      formField.sizes = JSON.parse(sizes);
    }
    if (colors) {
      formField.colors = JSON.parse(colors);
    }

    await Product.findByIdAndUpdate(
      req.params.id,
      { $set: formField },
      { new: true, useFindAndModify: false }
    );
    const result = await Product.findById(req.params.id).populate(
      "subcategory"
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
    const findData = await Product.findById(req.params.id);
    if (!findData) {
      return badRequest(res, null, "Content Not Found!");
    }

    // UPDATE DATA
    const result = await Product.findByIdAndDelete(req.params.id);
    return deleteSuccess(res, result);
  } catch (error) {
    return serverError(res, error);
  }
};

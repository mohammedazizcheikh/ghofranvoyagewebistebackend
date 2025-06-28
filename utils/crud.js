const { castObject } = require("../models/UserModel");
const { sendSuccessResponse, sendErrorResponse } = require("./response");

/**
 * Create a new document
 * @param {Model} Model - The Mongoose model.
 * @returns {Function} - Express middleware function.
 */
const createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    sendSuccessResponse(res, doc, 201);
  } catch (error) {
    sendErrorResponse(res, "Error creating document", 400, {
      error: error.message,
    });
  }
};

/**
 * Get all documents with support for filtering, sorting, pagination, and field limiting
 * @param {Model} Model - The Mongoose model.
 * @param {Object} [queryOptions] - Optional query options for Mongoose.
 * @returns {Function} - Express middleware function.
 */
const getAll =
  (Model, queryOptions = {}) =>
  async (req, res) => {
    try {
      // Filtering
      const queryObj = { ...req.query };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((el) => delete queryObj[el]);

      // Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      let query = Model.find(JSON.parse(queryStr));

      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // Field limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      // Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);

      const docs = await query;

      sendSuccessResponse(res, {
        results: docs.length,
        data: docs,
      });
    } catch (error) {
      sendErrorResponse(res, "Error retrieving documents", 400, {
        error: error.message,
      });
    }
  };

/**
 * Get a single document by ID with optional queryOptions (e.g., populate)
 * @param {Model} Model - The Mongoose model.
 * @param {Object} [queryOptions] - Optional query options for Mongoose.
 * @returns {Function} - Express middleware function.
 */
const getOne =
  (Model, queryOptions = {}) =>
  async (req, res) => {
    try {
      let query = Model.findById(req.params.id);

      // Apply optional query options such as populate
      if (queryOptions.populate) {
        query = query.populate(queryOptions.populate);
      }

      const doc = await query;

      if (!doc) {
        return sendErrorResponse(res, "No document found with that ID", 404);
      }

      sendSuccessResponse(res, doc);
    } catch (error) {
      sendErrorResponse(res, "Error retrieving document", 400, {
        error: error.message,
      });
    }
  };

/**
 * Update a document by ID with transaction support
 * @param {Model} Model - The Mongoose model.
 * @returns {Function} - Express middleware function.
 */
const updateOne = (Model) => async (req, res) => {
  try {
    const session = await Model.startSession();
    session.startTransaction();

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      session,
    });

    if (!doc) {
      await session.abortTransaction();
      session.endSession();
      return sendErrorResponse(res, "No document found with that ID", 404);
    }

    await session.commitTransaction();
    session.endSession();

    sendSuccessResponse(res, doc);
  } catch (error) {
    sendErrorResponse(res, "Error updating document", 400, {
      error: error.message,
    });
  }
};

/**
 * Soft delete or permanently delete a document by ID
 * @param {Model} Model - The Mongoose model.
 * @param {Boolean} [softDelete=false] - Whether to soft delete or hard delete.
 * @returns {Function} - Express middleware function.
 */
const deleteOne =
  (Model, softDelete = true) =>
  async (req, res) => {
    try {
      let doc;
      if (softDelete) {
        //id
        console.log(req.params.id);
        doc = await Model.findByIdAndUpdate(
          req.params.id,
          { isDeleted: true },
          { new: true }
        );
      } else {
        doc = await Model.findByIdAndDelete(req.params.id);
      }

      if (!doc) {
        return sendErrorResponse(res, "No document found with that ID", 404);
      }
      sendSuccessResponse(res, doc, 200);
    } catch (error) {
      sendErrorResponse(res, "Error deleting document", 400, {
        error: error.message,
      });
    }
  };

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
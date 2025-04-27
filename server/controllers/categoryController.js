const formatResultData = require("../utils/formatResultsData");
const pageAndLimitValidation = require("../utils/pageAndLimitValidation");
const categoryService = require("../services/categoryService");
const { ObjectId } = require("mongodb");

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This category already exists for the user and type.",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

const renameValueField = async (req, res) => {
  try {
    const result = await categoryService.renameValueToMoney();
    res.status(200).json({
      message: "Field renamed successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to rename field.",
      error: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    sort_by = "createdAt",
    sort_order = "desc",
  } = req.query;
  const pageNum = pageAndLimitValidation(page);
  const limitNum = pageAndLimitValidation(limit);
  try {
    const categories = await categoryService.getAllCategories(
      pageNum,
      limitNum,
      search,
      sort_by,
      sort_order
    );
    const total = await categoryService.countCategories(search);
    formatResultData({
      res,
      total,
      limitNum,
      pageNum,
      apiEndPoint: "categories",
      result: categories ?? [],
      totalResults: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleUserCategories = async (req, res, getCategoryFn, type) => {
  const { user, page = 1, limit = 12, search = "" } = req.query;
  const pageNum = pageAndLimitValidation(page);
  const limitNum = pageAndLimitValidation(limit);

  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "User Email is required" });
  }

  try {
    const result = await getCategoryFn(user, pageNum, limitNum, search);
    formatResultData({
      res,
      total: result?.total,
      limitNum,
      pageNum,
      apiEndPoint: `categories/${
        type === "Fund" ? "user-fund-categories" : "user-cost-categories"
      }`,
      queryString: `user=${user}&search=${search}`,
      result: result?.categories ?? [],
      totalResults: result?.total,
    });
  } catch (err) {
    console.error(`Error getting User ${type} Categories:`, err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const getUserFundCategories = async (req, res) => {
  return handleUserCategories(
    req,
    res,
    categoryService.getUserFundCategories,
    "Fund"
  );
};

const getUserCostCategories = async (req, res) => {
  return handleUserCategories(
    req,
    res,
    categoryService.getUserCostCategories,
    "Cost"
  );
};

// Get Single Category
const getCategoryByID = async (req, res) => {
  const categoryId = req.params.id;

  if (!categoryId) {
    return res.status(400).json({
      status: "error",
      message: "Category ID is required",
    });
  }

  try {
    const result = await categoryService.getCategoryById(categoryId);

    if (result) {
      return res.json({
        status: "success",
        message: "Executed Successfully",
        result: result,
      });
    } else {
      return res.status(404).json({
        status: "not found",
        message: "Category not found",
      });
    }
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error getting Category By ID:", err);

    // Send the error message to the client
    return res.status(500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const value = req.body;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid category ID" });
  }

  try {
    // Call the model to update the category
    const result = await categoryService.updateCategory(id, value);

    // Handle the case where the category is not found
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }

    const updatedCategory = await categoryService.getCategoryById(id);

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }

    res.json({
      status: "success",
      message: "Category updated successfully",
      result: updatedCategory,
    });
  } catch (err) {
    console.error("Error updating Category:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Delete Single Category
const deleteCategoryByID = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Category ID is required" });
  }

  try {
    const result = await categoryService.deleteCategoryByID(id);
    if (result) {
      res.json({
        status: "success",
        message: "Executed Successfully",
        result: result,
      });
    } else {
      res
        .status(404)
        .json({ status: "not found", message: "Category not found" });
    }
  } catch (err) {
    console.error("Error deleting Category By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const getSumOfDeletedSalaryFunds = async (req, res) => {
  const { user } = req.query;
  if(!user){ 
    res.status(400).json({ status: "error", message: "User Email is required" });
  }

  try {
    const result = await categoryService.getSumOfDeletedSalaryFunds(user);
    res.json({ status: "success", message: "Executed Successfully", result: result });
  } catch (err) {
    console.error("Error getting sum of deleted salary funds:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  createCategory,
  getCategory,
  getAllCategories,
  getUserFundCategories,
  getUserCostCategories,
  getCategoryByID,
  updateCategory,
  deleteCategoryByID,
  renameValueField,
  getSumOfDeletedSalaryFunds
};

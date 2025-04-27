const costService = require("../services/costService");
const formatResultData = require("../utils/formatResultsData");
const pageAndLimitValidation = require("../utils/pageAndLimitValidation");
const Category = require("../models/categoryModel");

const createCost = async (req, res) => {
  try {
    const cost = await costService.createCost(req.body);
    if (cost) {
      await Category.findOneAndUpdate(
        { name: cost.category, user: cost.user, type: "cost" },
        { $inc: { money: cost.money } }
      );
    }
    res.status(201).json({ success: true, data: cost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCosts = async (req, res) => {
  const {
    category_name,
    user,
    page = 1,
    limit = 20,
    sort_by = "createdAt",
    sort_order = "desc",
    search = "",
    start_date,
    end_date,
  } = req.query;

  const pageNum = pageAndLimitValidation(page);
  const limitNum = pageAndLimitValidation(limit);

  try {
    const { data, total } = await costService.getAllCosts(
      category_name,
      user,
      pageNum,
      limitNum,
      search,
      sort_by,
      sort_order,
      start_date,
      end_date
    );

    console.log("data", data);

    formatResultData({
      res,
      total,
      limitNum,
      pageNum,
      apiEndPoint: "costs",
      queryString: `category_name=${category_name}&user=${user}&search=${search}&start_date=${start_date}&end_date=${end_date}`,
      result: data ?? [],
      totalResults: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCostsByUserEmail = async (req, res) => {
  const {
    user: userEmail,
    sort_by = "_id",
    sort_order = "desc",
    search = "",
    start_date,
    end_date,
    page = 1,
    limit = 100,
  } = req.query;

  if (!userEmail) {
    return res
      .status(400)
      .json({ status: "error", message: "User Email ID is required" });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({
      status: "error",
      message: "Start Date and End Date is required",
    });
  }

  try {
    const pageNum = pageAndLimitValidation(page);
    const limitNum = pageAndLimitValidation(limit);
    const { data, total } = await costService.getCostsByUserEmail(
      userEmail,
      sort_by,
      sort_order,
      search,
      start_date,
      end_date,
      pageNum,
      limitNum
    );
    if (data) {
      formatResultData({
        res,
        total,
        limitNum,
        pageNum,
        apiEndPoint: "reports/user-costs",
        queryString: `user=${userEmail}&search=${search}&start_date=${start_date}&end_date=${end_date}`,
        result: data ?? [],
        totalResults: total,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Executed Successfully",
        results: { data: result?.costs },
      });
    }
  } catch (err) {
    console.error("Error getting cost By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Delete costs By IID
const deleteCostByID = async (req, res) => {
  const costID = req.query.id;

  if (!costID) {
    return res
      .status(400)
      .json({ status: "error", message: "cost ID is required" });
  }

  try {
    // Step 1: Get the cost/fund data before deleting
    const existingCost = await costService.getCostByID(costID);

    if (!existingCost) {
      return res
        .status(404)
        .json({ status: "not found", message: "Cost not found" });
    }

    // Step 2: Delete the cost
    const result = await costService.deleteCostByID(costID);

    // Step 3: Decrease category money for that user's category
    await Category.findOneAndUpdate(
      { name: existingCost.category, user: existingCost.user, type: "cost" },
      { $inc: { money: -existingCost.money } }
    );

    res.json({
      status: "success",
      message: "Executed Successfully",
      result: result,
    });
  } catch (err) {
    console.error("Error deleting cost By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Get costs By IID
const getCostByID = async (req, res) => {
  const costID = req.params.id;

  if (!costID) {
    return res
      .status(400)
      .json({ status: "error", message: "cost ID is required" });
  }

  try {
    const result = await costService.getCostByID(costID);
    if (result) {
      res.json({
        status: "success",
        message: "Executed Successfully",
        result: result,
      });
    } else {
      res.status(404).json({ status: "not found", message: "cost not found" });
    }
  } catch (err) {
    console.error("Error getting cost By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Update a cost
const updateCostByID = async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  try {
    const existingCost = await costService.getCostByID(id);

    if (!existingCost) {
      return res
        .status(404)
        .json({ status: "error", message: "Cost not found" });
    }

    // 🚫 Block category change
    if (newData.category && newData.category !== existingCost.category) {
      return res.status(400).json({
        status: "error",
        message: "Category change is not allowed",
      });
    }

    const moneyChanged =
      typeof newData.money === "number" && newData.money !== existingCost.money;

    const updatedCost = await costService.updateCostByID(id, newData);

    // ✅ If money is changed, update the category total
    if (moneyChanged) {
      const diff = newData.money - existingCost.money;

      await Category.findOneAndUpdate(
        { user: existingCost.user, name: existingCost.category, type: "cost" },
        { $inc: { money: diff } }
      );
    }

    if (updatedCost) {
      res.json({
        status: "success",
        message: "Executed Successfully",
        result: updatedCost,
      });
    }
  } catch (err) {
    console.error("Error Updating costs:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const getAYearTotalCosts = async (req, res) => {
  const { user, year } = req.query;

  if (!user || !year) {
    return res.status(400).json({
      status: "error",
      message: "User Email and year field is required",
    });
  }

  try {
    const yearNum = parseInt(year);
    const result = await costService.getAYearTotalCosts(user, yearNum);
    res.json({
      status: "success",
      message: "Executed Successfully",
      results: result,
    });
  } catch (err) {
    console.error("Error getting cost By User or Year:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  createCost,
  getAllCosts,
  getCostsByUserEmail,
  deleteCostByID,
  getCostByID,
  updateCostByID,
  getAYearTotalCosts,
};

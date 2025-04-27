const fundService = require("../services/fundService");
const formatResultData = require("../utils/formatResultsData");
const pageAndLimitValidation = require("../utils/pageAndLimitValidation");
const Category = require("../models/categoryModel");

const createFund = async (req, res) => {
  try {
    const fund = await fundService.createFund(req.body);
    if (fund) {
      await Category.findOneAndUpdate(
        { name: fund.category, user: fund.user, type: "fund" },
        { $inc: { money: fund.money } }
      );
    }
    res.status(201).json({ success: true, data: fund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFunds = async (req, res) => {
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
    const { data, total } = await fundService.getAllFunds(
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
      apiEndPoint: "funds",
      queryString: `category_name=${category_name}&user=${user}&search=${search}&start_date=${start_date}&end_date=${end_date}`,
      result: data ?? [],
      totalResults: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFundsByUserEmail = async (req, res) => {
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
    const { data, total } = await fundService.getFundsByUserEmail(
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
        apiEndPoint: "reports/user-funds",
        queryString: `user=${userEmail}&search=${search}&start_date=${start_date}&end_date=${end_date}`,
        result: data ?? [],
        totalResults: total,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Executed Successfully",
        results: { data: result?.funds },
      });
    }
  } catch (err) {
    console.error("Error getting Fund By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Delete FUnds By IID
const deleteFundByID = async (req, res) => {
  const fundID = req.query.id;

  if (!fundID) {
    return res
      .status(400)
      .json({ status: "error", message: "FUnd ID is required" });
  }

  try {
    const existingFund = await fundService.getFundByID(fundID);

    if (!existingFund) {
      return res.status(404).json({
        status: "not found",
        message: "AddFundCategoryModal not found",
      });
    }

    const result = await fundService.deleteFundByID(fundID);

    if (result) {
      // Step 3: Decrease category money for that user's category
      await Category.findOneAndUpdate(
        { name: existingFund.category, user: existingFund.user, type: "fund" },
        { $inc: { money: -existingFund.money } }
      );
      res.json({
        status: "success",
        message: "Executed Successfully",
        result: result,
      });
    } else {
      res.status(404).json({ status: "not found", message: "Fund not found" });
    }
  } catch (err) {
    console.error("Error deleting Fund By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Get FUnds By IID
const getFundByID = async (req, res) => {
  const fundID = req.params.id;

  if (!fundID) {
    return res
      .status(400)
      .json({ status: "error", message: "FUnd ID is required" });
  }

  try {
    const result = await fundService.getFundByID(fundID);
    if (result) {
      res.json({
        status: "success",
        message: "Executed Successfully",
        result: result,
      });
    } else {
      res.status(404).json({ status: "not found", message: "Fund not found" });
    }
  } catch (err) {
    console.error("Error getting Fund By ID:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// Update a FUnd
const updateFundByID = async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const existingFund = await fundService.getFundByID(id);

    if (!existingFund) {
      return res
        .status(404)
        .json({ status: "error", message: "Fund not found" });
    }

    // 🚫 Block category change
    if (newData.category && newData.category !== existingFund.category) {
      return res.status(400).json({
        status: "error",
        message: "Category change is not allowed",
      });
    }

    const moneyChanged = typeof newData.money === 'number' && newData.money !== existingFund.money;

    const updatedFund = await fundService.updateFundByID(id, newData);

    // ✅ If money is changed, update the category total
    if (moneyChanged) {
      const diff = newData.money - existingFund.money;

      await Category.findOneAndUpdate(
        { user: existingFund.user, name: existingFund.category, type: "fund" },
        { $inc: { money: diff } }
      );
    }

    if (updatedFund) {
      res.json({
        status: "success",
        message: "Executed Successfully",
        result: updatedFund,
      });
    }

  } catch (err) {
    console.error("Error Updating Funds:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


const getAYearTotalFunds = async (req, res) => {
  const { user, year } = req.query;

  if (!user || !year) {
    return res.status(400).json({
      status: "error",
      message: "User Email and year field is required",
    });
  }

  try {
    const yearNum = parseInt(year);
    const result = await fundService.getAYearTotalFunds(user, yearNum);
    res.json({
      status: "success",
      message: "Executed Successfully",
      results: result,
    });
  } catch (err) {
    console.error("Error getting Fund By User or Year:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  createFund,
  getAllFunds,
  getFundsByUserEmail,
  deleteFundByID,
  getFundByID,
  updateFundByID,
  getAYearTotalFunds,
};

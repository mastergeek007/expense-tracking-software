const express = require("express");
const categoryController = require("../controllers/categoryController");
const fundsController = require("../controllers/fundsController");
const calculationController = require('../controllers/calculationController');
const costController = require("../controllers/costController");
const updateController = require("../controllers/updateController");

const router = express.Router();

// Categories
router.post("/api/categories", categoryController.createCategory);
router.get("/api/categories/deleted-funds", categoryController.getSumOfDeletedSalaryFunds);
router.get("/api/categories/user-fund-categories", categoryController.getUserFundCategories);
router.get("/api/categories/user-cost-categories",categoryController.getUserCostCategories);
router.get("/api/categories", categoryController.getAllCategories);
router.patch("/api/categories/rename", categoryController.renameValueField);
router.put("/api/categories/update/:id", categoryController.updateCategory);
router.get("/api/categories/:id", categoryController.getCategoryByID);
router.delete("/api/categories/:id", categoryController.deleteCategoryByID);

// Funds
router.post("/api/funds", fundsController.createFund);
router.put("/api/funds/update/:id", fundsController.updateFundByID);
router.get("/api/funds", fundsController.getAllFunds);
router.get("/api/funds/details/:id", fundsController.getFundByID);
router.get("/api/funds/user-year-fund", fundsController.getAYearTotalFunds);
router.delete("/api/funds/delete", fundsController.deleteFundByID);
// router.delete('/api/funds/delete-user-category', fundsController.deleteFundsCategoryByUser);

// Costs
router.post("/api/costs", costController.createCost);
router.put("/api/costs/update/:id", costController.updateCostByID);
router.get("/api/costs", costController.getAllCosts);
router.get("/api/costs/details/:id", costController.getCostByID);
router.get("/api/costs/user-year-cost", costController.getAYearTotalCosts);
router.delete("/api/costs/delete", costController.deleteCostByID);
// router.delete('/api/costs/delete-user-category', costController.deleteCostCategoryByUser);

// User Details
router.get('/api/user-details', calculationController.getUserDetails);
router.get('/api/user-details-year', calculationController.getUserCustomYearDetails);
router.get('/api/user-details-month', calculationController.getUserCustomMonthDetails);

// Reports
router.get("/api/reports/user-costs", costController.getCostsByUserEmail);
router.get("/api/reports/user-funds", fundsController.getFundsByUserEmail);

// Update data
router.get('/api/update/fund-category-money', updateController.updateFundCategoryMoneyByUser);
router.get('/api/update/cost-category-money', updateController.updateCostCategoryMoneyByUser);

module.exports = router;

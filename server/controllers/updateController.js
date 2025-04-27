const Fund = require("../models/fundModel");
const Category = require("../models/categoryModel");
const Cost = require("../models/costModel");

const updateFundCategoryMoneyByUser = async() => {
  const funds = await Fund.find();

  // Grouping: { `${userId}-${categoryId}`: totalMoney }
  const totals = {};

  funds.forEach(fund => {
    const key = `${fund.user}-${fund.category}-fund`;
    if (!totals[key]) {
      totals[key] = 0;
    }
    totals[key] += fund.money;
  });

  // Update each category for that specific user
  for (const [key, totalMoney] of Object.entries(totals)) {
    const [user, category, type] = key.split('-');
    await Category.findOneAndUpdate(
      { name: category, user: user, type: type },
      { money: totalMoney }
    );
  }

  console.log('✅ Category money updated based on user and category match');
}

const updateCostCategoryMoneyByUser = async() => {
  const costs = await Cost.find();

  // Grouping: { `${userId}-${categoryId}`: totalMoney }
  const totals = {};

  costs.forEach(cost => {
    const key = `${cost.user}-${cost.category}-cost`;
    if (!totals[key]) {
      totals[key] = 0;
    }
    totals[key] += cost.money;
  });

  // Update each category for that specific user
  for (const [key, totalMoney] of Object.entries(totals)) {
    const [user, category, type] = key.split('-');
    await Category.findOneAndUpdate(
      { name: category, user: user, type: type },
      { money: totalMoney }
    );
  }

  console.log('✅ Category money updated based on user and category match');
}



module.exports = {
  updateFundCategoryMoneyByUser,
  updateCostCategoryMoneyByUser
}
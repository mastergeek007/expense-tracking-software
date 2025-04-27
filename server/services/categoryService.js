const Category = require("../models/categoryModel");
const Fund = require("../models/fundModel");

const createCategory = async (categoryData) => {
  const existingCategory = await Category.findOne({
    name: categoryData.name,
    user: categoryData.user,
    type: categoryData.type,
  });
  if (existingCategory) {
    throw new Error("This category already exists for the user and type.");
  } else {
    const category = new Category(categoryData);
    return await category.save();
  }
};

const renameValueToMoney = async () => {
  return await Category.updateMany(
    { value: { $exists: true } },
    { $rename: { value: "money" } }
  );
};

const countCategories = async (search = "") => {
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { user: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
    ];

    if (!isNaN(search)) {
      filter.$or.push({ money: Number(search) });
    }
  }
  return await Category.countDocuments(filter);
};

const getAllCategories = async (
  page,
  limit,
  search = "",
  sort_by = "createdAt",
  sort_order = "desc"
) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { user: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
    ];

    if (!isNaN(search)) {
      filter.$or.push({ money: Number(search) });
    }
  }

  const sortOptions = {
    [sort_by]: sort_order === "asc" ? 1 : -1,
  };
  return await Category.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);
};

const getUserCategories = async (
  user,
  type,
  page = 1,
  limit = 12,
  search = ""
) => {
  try {
    page = Math.max(1, parseInt(page));
    limit = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (page - 1) * limit;

    const baseQuery = { user, type };
    const query = buildSearchQuery(baseQuery, search);

    const pipeline = [
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [totalCount, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.aggregate(pipeline),
    ]);

    return { total: totalCount, categories };
  } catch (err) {
    console.error(`Failed to fetch ${type} categories:`, err);
    throw err;
  }
};

// Utility function to build search queries
const buildSearchQuery = (baseQuery, search) => {
  if (!search) return baseQuery;

  const query = { ...baseQuery };
  query.$or = [{ name: { $regex: search, $options: "i" } }];

  const searchAsNumber = parseFloat(search);
  if (!isNaN(searchAsNumber)) {
    query.$or.push({ value: searchAsNumber });
  }

  return query;
};

// Example usage for different category types
const getUserFundCategories = (user, page, limit, search) =>
  getUserCategories(user, "fund", page, limit, search);

const getUserCostCategories = (user, page, limit, search) =>
  getUserCategories(user, "cost", page, limit, search);

const getCategoryById = async (id) => {
  try {
    return await Category.findById(id);
  } catch (err) {
    console.error(`Failed to fetch category by ID:`, err);
    throw err;
  }
};

const updateCategory = async (id, data) => {
  try {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    console.error(`Failed to update category:`, err);
    throw err;
  }
};

const deleteCategoryByID = async (id) => {
  try {
    return await Category.findByIdAndDelete(id);
  } catch (err) {
    console.error(`Failed to delete category by ID:`, err);
    throw err;
  }
};

// get deleted data
const getSumOfDeletedSalaryFunds = async (userEmail) => {
  const salaryFunds = await Fund.aggregate([
    {
      $match: {
        user: userEmail,
        category: "Salary" // Match funds with category = "salary"
      }
    },
    {
      $group: {
        _id: null,
        money: { $sum: "$money" }
      }
    }
  ]);

  return salaryFunds[0]?.money ?? 0;
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  countCategories,
  getUserFundCategories,
  getUserCostCategories,
  getCategoryById,
  deleteCategoryByID,
  renameValueToMoney,
  getSumOfDeletedSalaryFunds
};

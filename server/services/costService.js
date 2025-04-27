const Cost = require("../models/costModel");
const formatLocalDate = require("./formatLocalDate");

const createCost = async (value) => {
  const cost = new Cost(value);
  return await cost.save();
};

const getAllCosts = async (
  category_name,
  user,
  page,
  limit,
  search = "",
  sort_by = "createdAt",
  sort_order = "desc",
  start_date,
  end_date
) => {
  const conditions = [{ user }, { category: category_name }];

  if (start_date && end_date) {
    conditions.push({ date: { $gte: start_date, $lte: end_date } });
  }

  const cleanSearch = search.trim();

  if (cleanSearch) {
    const orConditions = [
      { category: { $regex: cleanSearch, $options: "i" } },
      { notes: { $regex: cleanSearch, $options: "i" } },
      { user: { $regex: cleanSearch, $options: "i" } },
    ];

    if (!isNaN(cleanSearch)) {
      orConditions.push({ money: Number(cleanSearch) });
    }

    conditions.push({ $or: orConditions });
  }

  const filter = { $and: conditions };

  const sortOptions = {
    [sort_by]: sort_order === "asc" ? 1 : -1,
  };

  const [data, total] = await Promise.all([
    Cost.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Cost.countDocuments(filter),
  ]);

  return { data, total };
};

const getCostsByUserEmail = async (
  userEmail,
  sort_by = "_id",
  sort_order = "desc",
  search = "",
  start_date,
  end_date,
  page = 1,
  limit = 100
) => {
  try {
    const skip = (page - 1) * limit;
    const sort = {};
    sort[sort_by] = sort_order === "asc" ? 1 : -1;

    const query = { user: userEmail, date: {$gte: start_date, $lte: end_date} };

    // Add search condition if search term is provided
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchAsNumber = parseFloat(search);
      query.$or = [
        { category: { $regex: escapedSearch, $options: "i" } },
        { notes: { $regex: escapedSearch, $options: "i" } },
        { time: { $regex: escapedSearch, $options: "i" } },
        { date: { $regex: search, $options: "i" } },
      ];

      // Handle numeric search separately
      if (!Number.isNaN(searchAsNumber)) {
        query.$or.push({ money: searchAsNumber });
      }
    }

    const [data, total] = await Promise.all([
      Cost.find(query).sort(sort).lean(),
      Cost.countDocuments(query),
    ]);

    return { data, total };
  } catch (err) {
    throw err;
  }
};

const deleteCostByID = async (id) => {
  return await Cost.findByIdAndDelete(id);
};

const getCostByID = async (id) => {
  return await Cost.findById(id);
};

const updateCostByID = async (id, value) => {
  return await Cost.findByIdAndUpdate(id, value, { new: true });
};

const getAYearTotalCosts = async (userEmail, year) => {
  try {
    const monthlyTotals = {};
    const currentYearMonths = new Array(12).fill(0).map((_, index) => {
      return `${year}-${(index + 1).toString().padStart(2, "0")}`;
    });
    currentYearMonths.forEach((monthYear) => {
      monthlyTotals[monthYear] = 0;
    });

    // Fetch all Costs for the user (no date filter in DB)
    const Costs = await Cost.find({ user: userEmail });

    Costs.forEach((entry) => {
      if (!entry.date) return;

      const dateObj = new Date(entry.date);
      const monthYear = dateObj.toISOString().substring(0, 7); // "YYYY-MM"
      const entryYear = dateObj.getFullYear();

      if (
        entryYear === parseInt(year) &&
        monthlyTotals[monthYear] !== undefined
      ) {
        const money = parseFloat(
          (entry.money || "0").toString().replace(/,/g, "")
        );
        monthlyTotals[monthYear] += isNaN(money) ? 0 : money;
      }
    });

    const sortedMonthlyTotals = Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    return sortedMonthlyTotals;
  } catch (err) {
    console.log("Error in getAYearTotalCosts:", err);
    throw err;
  }
};

const getUserTotalCostAmount = async (userEmail) => {
  try {
    // Assuming you have a Mongoose model called `Cost`
    const result = await Cost.aggregate([
      { $match: { user: userEmail } },
      {
        $group: {
          _id: null,
          totalMoney: { $sum: "$money" },
        },
      },
    ]);

    const totalMoney = result.length > 0 ? result[0].totalMoney : 0;

    return { money: totalMoney };
  } catch (err) {
    console.error("Error in getUserTotalCostAmount:", err);
    throw err;
  }
};

const getAMonthUserTotalCostAmount = async (userEmail, currentMonth) => {
  try {
    // Define an array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Calculate the date range for the previous month
    const now = new Date();
    const year = now.getFullYear();

    let month;

    if (currentMonth) {
      month = now.getMonth() + 1; // Current month
    } else {
      month = now.getMonth(); // Previous month
      if (month === 0) {
        // Handle the edge case for January
        month = 12;
        year -= 1;
      }
    }

    // Get the month name
    const monthName = monthNames[month - 1];

    // Format the month with leading zero if necessary
    const formattedMonth = String(month).padStart(2, "0");

    const startDate = `${year}-${formattedMonth}-01`;
    const endDate = `${year}-${formattedMonth}-31`;

    // Aggregation pipeline to calculate the total money for the previous month
    const pipeline = [
      {
        $match: {
          user: userEmail,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      }, // Filter documents by user and date range
      { $group: { _id: null, totalMoney: { $sum: "$money" } } },
    ];

    const result = await Cost.aggregate(pipeline);

    // // Extract the total money value from the result
    const totalMoney = result.length > 0 ? result[0].totalMoney : 0;

    console.log("totalMoney", totalMoney);

    // Generate the desired object
    return { month: monthName, money: totalMoney };
  } catch (err) {
    console.log("Error", err);
  }
};

const getUserCurrentYearData = async (userEmail, year) => {
  try {
    // Array to hold results
    const resultData = [];

    let totalCost = 0;

    // Loop through all months of the specified year
    for (let month = 1; month <= 12; month++) {
      // Format the month with leading zero if necessary
      const formattedMonth = String(month).padStart(2, "0");

      const startDate = `${year}-${formattedMonth}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];

      // Aggregation pipeline to calculate total money for each month
      const pipeline = [
        {
          $match: {
            user: userEmail,
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        }, // Filter documents by user and date range
        { $group: { _id: null, totalMoney: { $sum: "$money" } } },
      ];

      const result = await Cost.aggregate(pipeline);

      // Extract the total money value from the result
      const totalMoney = result.length > 0 ? result[0].totalMoney : 0;

      totalCost += totalMoney;

      // Push the month and money into the resultData array
      resultData.push(totalMoney);
    }

    return { resultData, total: totalCost };
  } catch (err) {
    console.log("Error", err);
  }
};

const getUserMonthDailyData = async (userEmail, year, month) => {
  try {
    const daysInMonth = new Date(year, month, 0).getDate();

    const promises = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = String(day).padStart(2, "0");
      const formattedMonth = String(month).padStart(2, "0");
      const date = `${year}-${formattedMonth}-${formattedDay}`;

      const pipeline = [
        {
          $match: { user: userEmail, date: date },
        },
        {
          $group: {
            _id: null,
            totalMoney: { $sum: "$money" },
          },
        },
      ];

      promises.push(Cost.aggregate(pipeline));
    }

    const results = await Promise.all(promises);

    const dailyExpense = [];
    let totalSum = 0;

    results.forEach((result) => {
      const totalMoney = result.length > 0 ? result[0].totalMoney : 0;
      totalSum += totalMoney;
      dailyExpense.push(totalMoney);
    });

    return { dailyExpense, total: totalSum };
  } catch (err) {
    console.log("Error", err);
  }
};


const getCostByDay = async (userEmail, dayType = "today") => {
  try {
    const now = new Date();
    let targetDate = new Date(now);

    if (dayType === "yesterday") {
      targetDate.setDate(now.getDate() - 1);
    }

    const formattedDate = formatLocalDate(targetDate); // Local date in YYYY-MM-DD

    const dayName = targetDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const pipeline = [
      {
        $match: {
          user: userEmail,
          date: {
            $gte: formattedDate,
            $lte: formattedDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalMoney: { $sum: "$money" },
        },
      },
    ];

    const [result] = await Cost.aggregate(pipeline);
    const totalMoney = result?.totalMoney || 0;

    return {
      day: dayName,
      date: formattedDate,
      money: totalMoney,
    };
  } catch (error) {
    console.error(`Error fetching cost for ${dayType}:`, error);
    throw new Error(`Unable to fetch ${dayType}'s cost data.`);
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
  getUserTotalCostAmount,
  getAMonthUserTotalCostAmount,
  getUserCurrentYearData,
  getCostByDay,
  getUserMonthDailyData
};

import React, { useContext } from "react";
import BoxItem from "../../Components/common/BoxItem";
import MonthWiseChart from "../../Components/MonthWiseChart";
import PieChart from "../../Components/PieChart";
import Recent from "../../Components/Recent";
import { AuthContext } from "../../Context/AuthProvider";
import { useGetUserDetailsQuery } from "../../features/user/userAPI";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const { data: userDetails, isLoading } = useGetUserDetailsQuery(user?.email, {
    skip: !user?.email,
  });

  const boxItems = [
    {
      bg: "#E5F8ED",
      type: "fund",
      title: "Total Funds",
      valueKey: "totalIncome",
    },
    {
      bg: "#FEE8E2",
      type: "cost",
      title: "Total Costs",
      valueKey: "totalExpense",
    },
    {
      bg: "#E5F8ED",
      type: "fund",
      title: "This Month Funds",
      valueKey: "currentMonthFund",
    },
    {
      bg: "#FEE8E2",
      type: "cost",
      title: "This Month Costs",
      valueKey: "currentMonthExpense",
    },
    {
      bg: "#E5F8ED",
      type: "fund",
      title: "Today's Funds",
      valueKey: "todayIncome",
    },
    {
      bg: "#FEE8E2",
      type: "cost",
      title: "Today's Costs",
      valueKey: "todayExpense",
    },
    {
      bg: "#E5F8ED",
      type: "fund",
      title: "Previous Day Funds",
      valueKey: "yesterdayIncome",
    },
    {
      bg: "#FEE8E2",
      type: "cost",
      title: "Previous Day Costs",
      valueKey: "yesterdayExpense",
    },
  ];

  const secondRowItems = [
    {
      bg: "#E5F8ED",
      type: "fund",
      title: "Previous Month Funds",
      valueKey: "prevMonthFund",
    },
    {
      bg: "#FEE8E2",
      type: "cost",
      title: "Previous Month Costs",
      valueKey: "prevMonthMonthExpense",
    },
    {
      mainBg: "#1B2850",
      type: "rest",
      title: "Rest Funds",
      valueKey: "restFund",
    },
  ];

  return (
    <div className="">
      <div>
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 justify-center">
          {boxItems.map((item, index) => (
            <BoxItem
              key={index}
              bg={item.bg}
              type={item.type}
              title={item.title}
              value={userDetails?.result?.[item.valueKey]?.money}
              isLoading={isLoading}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 justify-center mt-5">
          {secondRowItems.map((item, index) => (
            <BoxItem
              key={index}
              bg={item.bg}
              mainBg={item.mainBg}
              type={item.type}
              title={item.title}
              value={userDetails?.result?.[item.valueKey]?.money}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      <hr class="my-5" />

      <div className="">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Year Wise Report</h1>
        <PieChart />
      </div>
      <hr class="my-5" />
      <div className="">
      <h1 className="text-2xl font-semibold text-gray-800 mb-3">Month Wise Report</h1>
        <MonthWiseChart />
      </div>
      <hr class="my-5" />
      <div className="">
        <Recent />
      </div>
    </div>
  );
};

export default Dashboard;

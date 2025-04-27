import { useContext, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AuthContext } from "../Context/AuthProvider";
import { useGetUserMonthWiseDetailsQuery } from "../features/user/userAPI";
import { formatNumbersWithCommas } from "../utils/formatNumbersWithCommas";
import SelectBox from "./common/SelectBox";
import Skeleton from "./Loading/Skeleton";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

export default function MonthWiseChart() {
  const { user } = useContext(AuthContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );

  const { data: userMonthWiseData, isLoading } =
    useGetUserMonthWiseDetailsQuery(
      {
        email: user?.email,
        year,
        month,
      },
      {
        skip: !user?.email || !year || !month,
      }
    );

  const state = {
    series: [
      {
        name: "Income",
        data: userMonthWiseData?.result?.income?.dailyIncome,
      },
      {
        name: "Expense",
        data: userMonthWiseData?.result?.expense?.dailyExpense,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#185519", "#B8001F"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
      },
      yaxis: {
        title: {
          text: "TK per day",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          formatter: function (day) {
            const selectedMonth = month; // already like "04" for April
            const selectedYear = year;
            const date = new Date(`${selectedYear}-${selectedMonth}-${day}`);
            const options = { day: "2-digit", month: "short", year: "numeric" };
            return date.toLocaleDateString("en-US", options); // Example: "11 Apr, 2025"
          },
        },
        y: {
          formatter: function (val) {
            // Format the number with commas
            const formattedValue = new Intl.NumberFormat().format(val);
            return "৳ " + formattedValue; // Example: "৳ 1,000"
          },
        },
      },
    },
  };

  return (
    <div
      id="chart"
      className="xl:col-span-2 col-span-1 bg-white rounded-lg shadow-lg"
    >
      {isLoading ? (
        <div className="h-[350px] w-full flex justify-center items-center">
          <LoadingSpinner color="#0B1B34" size={100} borderSize={10} />
        </div>
      ) : (
        <div>
          <div className="md:flex grid md:justify-between text-center gap-3 md:items-center p-3 border-b">
            <div className="flex gap-3">
              <SelectBox value={year} onChange={setYear} type="year" />
              <SelectBox
                value={Number(month)}
                onChange={setMonth}
                type="month"
              />
            </div>
            <div className="md:flex gap-3">
              <p>
                Total Income:{" "}
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <span className="font-bold text-[#185519]">
                    {formatNumbersWithCommas(
                      userMonthWiseData?.result?.income?.total
                    )}
                  </span>
                )}
              </p>
              <p>
                Total Expense:{" "}
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <span className="font-bold text-[#B8001F]">
                    {formatNumbersWithCommas(
                      userMonthWiseData?.result?.expense?.total
                    )}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="p-3">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      )}
    </div>
  );
}

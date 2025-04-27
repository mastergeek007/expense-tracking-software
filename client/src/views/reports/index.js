import { NavLink } from "react-router-dom";

const Reports = () => {
  const reportLists = [
    {
      id: 1,
      name: "Incomes Report",
      description: "This is the report for Incomes",
      link: "/reports/incomes",
      color: "bg-green-500",
    },
    {
      id: 2,
      name: "Expenses Report",
      description: "This is the report for Expenses",
      link: "/reports/expenses",
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {reportLists.map((report) => (
          <NavLink to={report.link}>
            <div
              className={`p-5 rounded-md shadow-md ${report.color} text-white`}
            >
              <h3 className="text-xl font-semibold">{report.name}</h3>
              <p className="mt-3">{report.description}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Reports;

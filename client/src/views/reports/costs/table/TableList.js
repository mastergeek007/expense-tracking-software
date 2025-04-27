import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useGetUserCostListsQuery } from "../../../../features/costs/costsAPI";
import BaseTableList from "./../../../../Components/table/BaseTableList";
import { AuthContext } from "./../../../../Context/AuthProvider";
import TableRowItem from "./TableRowItem";

const TableList = () => {
  const { user } = useContext(AuthContext);
  const { search, start_date, end_date, sort_by, sort_order } = useSelector(
    (state) => state.filters
  );

  const {
    data: costLists,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserCostListsQuery(
    {
      email: user?.email,
      sort_by,
      sort_order,
      search,
      start_date,
      end_date,
    },
    {
      skip: !start_date && !end_date,
    }
  );

  const {
    data: funds,
    totalPages,
    totalResults,
    totalAmount,
  } = costLists?.results || {};

  const columns = [
    {
      name: "SL No",
      sort_by: "sl_no",
      sort_order: "",
      isSort: false,
    },
    {
      name: "Date",
      sort_by: "date",
      sort_order: "",
      isSort: true,
    },
    {
      name: "Category Name",
      sort_by: "category",
      sort_order: "",
      isSort: true,
    },
    {
      name: "Amount",
      sort_by: "money",
      sort_order: "",
      isSort: true,
    },
    {
      name: "Note",
      sort_by: "notes",
      sort_order: "",
      isSort: true,
    },
    {
      name: "Time",
      sort_by: "time",
      sort_order: "",
      isSort: true,
    },
  ];

  const breadcrumbs = [
    {
      id: 1,
      name: "Reports",
      path: "/reports",
    },
    {
      id: 2,
      name: "Expenses Report",
      path: "",
    },
  ];

  return (
    <div className="">
      <BaseTableList
        columns={columns}
        values={funds?.map((item, index) => (
          <TableRowItem
            key={item._id} // Ensure each row has a unique key
            rowData={item}
            index={index}
          />
        ))}
        total={totalAmount}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isShowDelete={false}
        isShowSearch={true}
        isShowDate={true}
        isRefresh={true}
        breadcrumbs={breadcrumbs}
        title="Expenses Report"
        totalPages={1}
        totalResults={totalResults}
      />
    </div>
  );
};

export default TableList;

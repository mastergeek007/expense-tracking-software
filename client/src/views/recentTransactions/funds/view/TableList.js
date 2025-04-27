import { useContext } from "react";
import { useSelector } from "react-redux";
import BaseTableList from "../../../../Components/table/BaseTableList";
import { useGetUserRecentFundsTransactionsQuery } from "../../../../features/funds/fundsAPI";
import { AuthContext } from "./../../../../Context/AuthProvider";
import TableRowItem from "./TableRowItem";

export default function TableList() {
  const { user } = useContext(AuthContext);
  const { page, limit, search, sort_by, sort_order, today } = useSelector(
    (state) => state.filters
  );

  // Check if user email is available before making the query
  const {
    data: recentCostsTransactions,
    error,
    isError,
    isLoading,
  } = useGetUserRecentFundsTransactionsQuery(
    {
      email: user?.email,
      page,
      limit,
      sort_by,
      sort_order,
      search,
      start_date: today,
      end_date: today,
    },
    {
      skip: !user?.email || !today,
    }
  );

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
      name: "Category",
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

  return (
    <div>
      <BaseTableList
        columns={columns}
        values={recentCostsTransactions?.results?.data?.map((item, index) => (
          <TableRowItem
            key={item._id} // Ensure each row has a unique key
            rowData={item}
            index={index}
          />
        ))}
        total={recentCostsTransactions?.results?.totalAmount}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isShowDelete={false}
        isShowSearch={false}
        isShowDate={false}
        isRefresh={false}
      />
    </div>
  );
}

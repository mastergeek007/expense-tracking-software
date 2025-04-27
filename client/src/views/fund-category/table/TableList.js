import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import BaseTableList from "../../../Components/table/BaseTableList";
import { AuthContext } from "../../../Context/AuthProvider";
import { useGetUserFundCategoriesQuery } from "../../../features/categories/categoryAPI";
import DeleteCategoryModal from "../../cost-category/modal/DeleteCategoryModal";
import TableRowItem from "./TableRowItem";

const TableList = () => {
  const { user } = useContext(AuthContext);
  const { page, limit, search } = useSelector((state) => state.filters);
  const [item, setItem] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: fundCategories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserFundCategoriesQuery({
    user: user?.email,
    page,
    limit,
    search,
  });

  const {
    data: categories,
    totalPages,
    totalResults,
  } = fundCategories?.results || {};

  const columns = [
    {
      name: "SL No",
      sort_by: "sl_no",
      sort_order: "",
      isSort: false,
    },
    {
      name: "Category Name",
      sort_by: "name",
      sort_order: "",
      isSort: true,
    },
    {
      name: "Amount",
      sort_by: "money",
      sort_order: "",
      isSort: true,
    },
  ];

  const breadcrumbs = [
    {
      id: 1,
      name: "Funds",
      path: "/fund-category",
    },
    {
      id: 2,
      name: "Delete Fund Category",
      path: "",
    },
  ];

  return (
    <div className="">
      <BaseTableList
        columns={columns}
        values={categories?.map((item, index) => (
          <TableRowItem
            key={item._id} // Ensure each row has a unique key
            rowData={item}
            index={index}
            setShowDeleteModal={setIsModalOpen}
            setItem={setItem}
            page={page}
            limit={limit}
          />
        ))}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isShowDelete={true}
        isShowSearch={true}
        isShowDate={false}
        isRefresh={true}
        breadcrumbs={breadcrumbs}
        title="Fund Category Lists"
        totalPages={totalPages}
        totalResults={totalResults}
      />

      {isModalOpen && (
        <DeleteCategoryModal
          showDeleteModal={isModalOpen}
          setShowDeleteModal={setIsModalOpen}
          item={item}
        />
      )}
    </div>
  );
};

export default TableList;

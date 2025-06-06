import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/dist";
import BoxItem from "../../Components/common/BoxItem";
import BoxLoading from "../../Components/Loading/BoxLoading";
import Pagination from "../../Components/pagination/Pagination";
import { AuthContext } from "../../Context/AuthProvider";
import { useGetUserFundCategoriesQuery } from "../../features/categories/categoryAPI";
import CategoryLayout from "../../Layout/CategoryLayout";
import AddFundCategoryModal from "./modal/AddFundCategoryModal";

export const GridLayout = ({ children }) => (
  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 justify-center my-10">
    {children}
  </div>
);

export const MessageLayout = ({ children }) => (
  <div className="h-[100vh] px-6 flex items-center justify-center">
    {children}
  </div>
);

const FundsCategoryLists = () => {
  const { user } = useContext(AuthContext);
  const { page, limit, search } = useSelector((state) => state.filters);
  const [showModal, setShowModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const {
    data: fundCategories,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserFundCategoriesQuery(
    {
      user: user?.email,
      page,
      limit,
      search,
    },
    {
      skip: !user,
    }
  );

  const { totalPages, totalResults } = fundCategories?.results || {};

  let content;
  if (isLoading) {
    content = (
      <GridLayout>
        <BoxLoading value="6" />
      </GridLayout>
    );
  } else if (!isLoading && isError) {
    content = (
      <MessageLayout>
        <h1 className="md:text-2xl sm:text-xl text-lg text-center font-semibold">
          {error?.data}
        </h1>
      </MessageLayout>
    );
  } else if (
    !isLoading &&
    isSuccess &&
    fundCategories?.results?.data?.length === 0
  ) {
    content = (
      <MessageLayout>
        <h1 className="md:text-2xl sm:text-xl text-lg text-center font-semibold">
          You Have not any Fund Category. Please Create a Fund Category FIrst
        </h1>
      </MessageLayout>
    );
  } else if (
    !isLoading &&
    isSuccess &&
    fundCategories?.results?.data?.length > 0
  ) {
    content = (
      <GridLayout>
        {fundCategories?.results?.data?.map((category) => (
          <Link key={category?._id} to={`/fund-category/${category?.name}`}>
            <BoxItem
              key={category?._id}
              bg="#E5F8ED"
              type="fund"
              title={category?.name}
              value={category?.money}
              isLoading={isLoading}
            />
          </Link>
        ))}
      </GridLayout>
    );
  }

  let pagination;
  if (!isLoading && totalPages > 0) {
    pagination = (
      <div className="bg-white p-3 rounded-lg shadow-lg">
        <Pagination pages={totalPages} total={totalResults} />
      </div>
    );
  }

  return (
    <CategoryLayout title="Fund Categories" setShowModal={setShowModal}>
      {content}

      {totalPages > 1 && pagination}

      {showModal && (
        <AddFundCategoryModal
          showModal={showModal}
          setShowModal={setShowModal}
          setIsCreate={setIsCreate}
        />
      )}
    </CategoryLayout>
  );
};

export default FundsCategoryLists;

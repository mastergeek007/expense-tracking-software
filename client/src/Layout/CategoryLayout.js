import React, { useState } from "react";
import { useDispatch } from "react-redux";
import BaseButton from "../Components/button/BaseButton";
import Search from "../Components/common/Search";
import { PlusIcon } from "../Components/icons/PlusIcon";
import RefreshIcon from "../Components/icons/RefreshIcon";
import { setRefresh } from "../features/filters/filterSlice";

const CategoryLayout = ({ children, title = "Categories", setShowModal }) => {
  const dispatch = useDispatch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    dispatch(setRefresh());
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <div className="sm:flex grid justify-between items-center bg-white p-3 rounded-lg shadow-md gap-3">
        <div>
          <h1 className="text-xl lg:text-center text-left font-semibold text-primary capitalize">
            {title}
          </h1>
        </div>
        <div className="sm:flex grid justify-end gap-3">
          <div>
            <Search refreshTrigger={refreshTrigger} width="w-64" />
          </div>
          <div className="flex gap-3 items-center">
          <BaseButton handleClick={handleRefresh}>
            <RefreshIcon className="text-white size-7" />
          </BaseButton>
          <BaseButton>
            <label htmlFor="category-modal">
              <div onClick={() => setShowModal(true)}>
                <PlusIcon className="text-white size-7" />
              </div>
            </label>
          </BaseButton>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default CategoryLayout;

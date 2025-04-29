import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setRefresh } from "../../features/filters/filterSlice";
import BaseButton from "../button/BaseButton";
import BaseDatePicker from "../common/BaseDatePicker";
import BreadCrumbs from "../common/BreadCrumbs";
import Search from "../common/Search";
import ExportPreview from "../export/ExportPreview";
import ExportIcon from "../icons/ExportIcon";
import RefreshIcon from "../icons/RefreshIcon";
import Pagination from "../pagination/Pagination";
import BaseTable from "./BaseTable";

export default function BaseTableList({
  columns,
  values,
  total,
  isLoading,
  error,
  isError,
  isShowDelete = true,
  isShowDate = true,
  isShowSearch = true,
  isRefresh = true,
  breadcrumbs = [],
  title = "",
  totalPages = 1,
  totalResults = 12,
}) {
  const dispatch = useDispatch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { category } = useParams();
  const exportRef = useRef();
  const { start_date, end_date } = useSelector((state) => state.filters);

  const handleRefresh = () => {
    dispatch(setRefresh());
    setRefreshTrigger((prev) => prev + 1);
  };

  // Inside your BaseTableList component, replace the handleExport function:

  const handleExport = () => {
    console.log("values", values);
    if (values?.length > 0 || (start_date && end_date)) {
      exportRef.current?.print();
      return;
    }
    toast.error("Please select start date and end date");
  };

  let pagination;
  if (!isLoading) {
    pagination = (
      <div className="bg-white p-3 rounded-lg shadow-lg my-10">
        <Pagination pages={totalPages} total={totalResults} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col bg-white rounded-lg">
        {/* <div className="-m-1.5 overflow-x-auto"> */}
          <div className="min-w-full inline-block align-middle">
            <div className="rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="md:flex grid justify-between px-5 items-center md:py-0 py-3">
                <div>
                  <h1 className="text-xl font-semibold text-primary capitalize">
                    {title ? title : category}
                  </h1>
                  {breadcrumbs.length > 0 && (
                    <BreadCrumbs breadcrumbs={breadcrumbs} className="mt-2" />
                  )}
                </div>
                <div className="md:flex items-center gap-3">
                  {isShowSearch && (
                    <div className="py-3 w-full">
                      <Search refreshTrigger={refreshTrigger} width="md:w-64 w-full" />
                    </div>
                  )}
                  {isShowDate && (
                    <div className="py-3 md:w-[300px] w-full z-30">
                      <BaseDatePicker refreshTrigger={refreshTrigger} />
                    </div>
                  )}
                  {isRefresh && (
                    <div className="flex items-center justify-center gap-3">
                      <BaseButton handleClick={handleRefresh}>
                        <RefreshIcon />
                      </BaseButton>
                      <BaseButton handleClick={handleExport} className="p-3">
                        <ExportIcon />
                      </BaseButton>
                    </div>
                  )}
                </div>
              </div>

              <BaseTable
                columns={columns}
                total={total}
                isShowDelete={isShowDelete}
                isLoading={isLoading}
                lists={values}
                isError={isError}
                error={error}
              />
            </div>
          </div>
        {/* </div> */}
      </div>
      {totalPages > 1 && pagination}

      <div className="hidden">
        <ExportPreview
          ref={exportRef}
          title={title || category}
          columns={columns}
          values={values}
          total={total}
        />
      </div>
    </div>
  );
}

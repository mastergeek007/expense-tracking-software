import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "../../../Components/icons/DeleteIcon";
import { EditIcon } from "../../../Components/icons/EditIcon";
import { formatNumbersWithCommas } from "../../../utils/formatNumbersWithCommas";

export default function CostCategoryTableRowItem({
  rowData,
  index,
  setShowModal,
  setShowDeleteModal,
  setItem,
  page,
  limit,
}) {
  const { category, notes, money, time, date } = rowData;
  const [startIndex, setStartIndex] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    setStartIndex((page - 1) * limit + index);
  }, [page, limit, index]);

  const handleEdit = () => {
    navigate(`/edit-cost/${rowData._id}`);
  };
  return (
    <>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
          {startIndex + 1}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
          {date}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          <span className="bg-red-600 text-white px-2 py-1 rounded-lg">
            {category}
          </span>
        </td>
        <td class="px-6 py-4 font-bold whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {formatNumbersWithCommas(money)} TK
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {notes}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {time}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          <div className="flex justify-end gap-1">
            <div>
              <EditIcon
                onClick={handleEdit}
                className="cursor-pointer w-8 h-8 border border-green-600 hover:bg-green-600 text-green-600 hover:text-white p-1.5 rounded-full"
              />
            </div>
            <div
              onClick={() => {
                setItem(rowData);
                setShowDeleteModal(true);
              }}
            >
              <DeleteIcon className="cursor-pointer w-8 h-8 border border-red-600 hover:bg-red-600 text-red-600 hover:text-white p-1.5 rounded-full" />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

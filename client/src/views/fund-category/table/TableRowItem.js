import { useEffect, useState } from "react";
import { DeleteIcon } from "../../../Components/icons/DeleteIcon";

export default function TableRowItem({
  rowData,
  index,
  setShowDeleteModal,
  setItem,
  page,
  limit,
}) {
  const [startIndex, setStartIndex] = useState(1);

  useEffect(() => {
    setStartIndex((page - 1) * limit + index);
  }, [page, limit, index]);

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {startIndex + 1}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          <span className="bg-green-600 text-white px-2 py-1 rounded-lg">
            {rowData?.name}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {rowData?.money} TK
        </td>
        <td class="flex justify-end px-6 items-center py-4">
          <div
            onClick={() => {
              setItem(rowData);
              setShowDeleteModal(true);
            }}
          >
            <DeleteIcon className="cursor-pointer w-8 h-8 border border-red-600 hover:bg-red-600 text-red-600 hover:text-white p-1.5 rounded-full" />
          </div>
        </td>
      </tr>
    </>
  );
}

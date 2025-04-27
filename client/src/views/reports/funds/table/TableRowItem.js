import dateFormat from "../../../../controllers/dateFormat";

export default function TableRowItem({ rowData, index }) {
  const { date, category, money, notes, time } = rowData;

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {index + 1}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {date}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          <span className="bg-green-600 text-white px-2 py-1 rounded-lg">
            {category}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {money} TK
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {notes}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {dateFormat(time)}
        </td>
      </tr>
    </>
  );
}

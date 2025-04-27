import moment from "moment";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../Context/AuthProvider";

const ExportPreview = forwardRef(
  ({ title, columns = [], values = [], total = 0 }, ref) => {
    const { user } = useContext(AuthContext);
    const { start_date, end_date } = useSelector((state) => state.filters);
    const exportRef = useRef();

    const handlePrint = () => {
      const content = document.getElementById("export-content").innerHTML;
      const printWindow = window.open("", "_blank", "width=1000, height=700");

      printWindow.document.write(`
      <html>
        <head>
          <title>${title || "Export Preview"}</title>
          <style>
            body { font-family: sans-serif; padding: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #f4f4f4; }
            h2, p { margin: 4px 0; }
            .header { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    };

    // 🔥 Expose the handlePrint to parent via ref
    useImperativeHandle(ref, () => ({
      print: handlePrint,
    }));

    return (
      <div className="my-6">
        <div
          ref={exportRef}
          id="export-content"
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-300"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2>Name: {user?.displayName}</h2>
              <p>Email: {user?.email}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 className="text-lg font-bold">{title || "Export Preview"}</h2>
              <p>
                From: <b>{moment(start_date).format("ll")}</b> to{" "}
                <b>{moment(end_date).format("ll")}</b>
              </p>
              <p>
                <b>Total: {total} TK</b>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left border-b border-gray-300 text-sm font-medium text-gray-700"
                      style={{
                        fontSize: "12px",
                        minWidth: idx === 0 ? "30px" : "100px",
                      }}
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="table-body" style={{ fontSize: "12px" }}>
                {values.length > 0 ? (
                  values.map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td>{rowIndex + 1}</td>
                      {columns.slice(1).map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 border-b border-gray-200 text-sm text-gray-800"
                          style={{ fontSize: "12px" }}
                        >
                          {item?.props?.rowData[col.sort_by]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center text-gray-500 py-4"
                    >
                      No data to preview.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

export default ExportPreview;

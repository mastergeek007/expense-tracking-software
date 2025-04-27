import { useState } from "react";

const useManualPDFExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const exportToPDF = ({ title, columns, data }) => {
    setIsGenerating(true);

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Prepare HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              color: #333;
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #2980b9;
              color: white;
              padding: 8px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #f5f5f5;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #777;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${columns.map((col) => `<th>${col.header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${columns
                  .map((col) => {
                    let cellValue = "";
                    if (col.accessor.includes(".")) {
                      const keys = col.accessor.split(".");
                      cellValue =
                        keys.reduce((obj, key) => obj?.[key], row) || "";
                    } else {
                      cellValue = row[col.accessor] || "";
                    }
                    return `<td>${cellValue}</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="footer">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      setIsGenerating(false);
    };
  };

  return { exportToPDF, isGenerating };
};

export default useManualPDFExport;

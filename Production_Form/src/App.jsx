
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(("0" + (new Date().getMonth() + 1)).slice(-2));
  const [day, setDay] = useState(("0" + new Date().getDate()).slice(-2));
  const [rows, setRows] = useState([]);

  const fields = [
    "Date", "JUTE ISSUE", "WASTAGE CONSUME", "TOTAL",
    "SPINNING PROD", "TWISTING PROD", "TWISTING PACKED",
    "TWISTING LOOSE", "TWISTING SALE", "TWISTING INCREASE/DECREASE",
    "HESSAIN PROD", "HESSAIN PACKED", "HESSAIN LOOSE",
    "HESSAIN SALE", "HESSAIN INCREASE/DECREASE",
    "BROD LOOM/CBC PROD", "BROD LOOM/CBC PACKED", "BROD LOOM/CBC LOOSE",
    "BROD LOOM/CBC SALE", "BROD LOOM/CBC INCREASE/DECREASE",
    "SACKING PROD", "SACKING PACKED", "SACKING LOOSE",
    "SACKING SALE", "SACKING INCREASE/DECREASE",
    "JUTE WEBBING PROD", "JUTE WEBBING PACKED", "JUTE WEBBING LOOSE",
    "JUTE WEBBING SALE", "JUTE WEBBING INCREASE/DECREASE",
    "SULZER PROD", "SULZER PACKED", "SULZER LOOSE",
    "SULZER SALE", "SULZER INCREASE/DECREASE",
    "SOIL SAVAR PROD", "SOIL SAVAR PACKED", "SOIL SAVAR LOOSE",
    "SOIL SAVAR SALE", "SOIL SAVAR INCREASE/DECREASE",
    "TOTAL", "WINDING WEAVING DIFF.",
    "SPOOL WINDING STOCK", "COP WINDING STOCK",
    "TOTAL (SPOOL WINDING STOCK + COP WINDING STOCK)",
    "INCREASE/DECREASE"
  ];

  const handleAddRow = () => {
    const date = `${year}-${month}-${day}`;
    const newRow = { Date: date };
    fields.slice(1).forEach(f => newRow[f] = "");
    setRows([...rows, newRow]);
  };

  const handleInputChange = (rowIdx, field, value) => {
    const updated = [...rows];
    updated[rowIdx][field] = value;
    setRows(updated);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Production");
    const fileName = `PRODUCTION-${year}-${month}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        🏭 Production Data Entry (Futuristic)
      </h1>

      {/* Date Selectors */}
      <div className="flex gap-4 mb-6 justify-center">
        <select className="p-2 rounded bg-gray-800" value={year} onChange={e => setYear(e.target.value)}>
          {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 5 + i)
            .map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="p-2 rounded bg-gray-800" value={month} onChange={e => setMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => ("0" + (i + 1)).slice(-2))
            .map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="p-2 rounded bg-gray-800" value={day} onChange={e => setDay(e.target.value)}>
          {Array.from({ length: 31 }, (_, i) => ("0" + (i + 1)).slice(-2))
            .map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Add Row */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleAddRow}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg shadow-lg hover:scale-105 transition">
          ➕ Add Entry
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border border-gray-700 w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              {fields.map(f => <th key={f} className="px-2 py-1 border border-gray-700">{f}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="odd:bg-gray-900 even:bg-gray-800">
                {fields.map((f, colIdx) => (
                  <td key={colIdx} className="border border-gray-700">
                    {f === "Date" ? row[f] :
                      <input
                        value={row[f]}
                        onChange={e => handleInputChange(rowIdx, f, e.target.value)}
                        className="w-24 p-1 bg-transparent outline-none"
                        onKeyDown={(e) => {
                          if (["Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
                            e.preventDefault();
                            const inputs = Array.from(document.querySelectorAll("tbody input"));
                            const idx = inputs.indexOf(e.target);
                            if (e.key === "ArrowDown" || e.key === "Enter") {
                              if (idx + 1 < inputs.length) inputs[idx + 1].focus();
                            } else if (e.key === "ArrowUp") {
                              if (idx > 0) inputs[idx - 1].focus();
                            }
                          }
                        }}
                      />
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={exportExcel}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transition">
          💾 Save to Excel
        </button>
      </div>
    </div>
  );
}

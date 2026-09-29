import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted text-sm">
        No data available.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-125">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-border/40 backdrop-blur-sm border-b border-border z-10 text-xs font-semibold text-muted uppercase tracking-wider">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body with Zebra Striping */}
          <tbody className="divide-y divide-border text-sm text-foreground">
            {data.map((row, rowIndex) => (
              <tr 
                key={keyExtractor(row)} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${rowIndex % 2 === 1 ? 'bg-border/20' : 'bg-card'} ${
                  onRowClick ? 'cursor-pointer hover:bg-border/40' : 'hover:bg-border/30'
                }`}
              >
                {columns.map((col, colIndex) => {
                  const content = typeof col.accessor === 'function' 
                    ? col.accessor(row) 
                    : (row[col.accessor] as React.ReactNode);

                  return (
                    <td key={colIndex} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
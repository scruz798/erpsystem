import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  title?: string;
  actionButton?: React.ReactNode;
  exportFileName?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKeys,
  title,
  actionButton,
  exportFileName = 'hzhy_erp_data'
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();

    if (searchKeys && searchKeys.length > 0) {
      return searchKeys.some(key => {
        const val = item[key];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
      });
    }

    return Object.values(item).some(val => 
      val !== undefined && val !== null && String(val).toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV Export
  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(item => 
      columns.map(c => {
        const val = (item as any)[c.key];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {title && (
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {filteredData.length} Records
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          {/* Action button passed from parent */}
          {actionButton}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {paginatedData.length > 0 ? (
              paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-3.5 whitespace-nowrap">
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  No records found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

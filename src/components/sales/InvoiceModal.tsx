import React from 'react';
import { SalesOrder } from '../../types/erp';
import { Modal } from '../common/Modal';
import { Building2, Printer, Download, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice / Sales Order #${order.orderNumber}`}
      subtitle="Formatted Commercial Invoice for Export / Billing"
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Digital signature verified by HZHY Finance</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      }
    >
      <div id="printable-invoice" className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs space-y-6">
        {/* Header Branding */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                HZHY ENTERPRISE LTD.
              </h2>
              <p className="text-[11px] text-slate-500">
                Industrial Heavy Assembly & Microelectronics Division
              </p>
              <p className="text-[10px] text-slate-400">
                740 Enterprise Parkway, Building A • Tax ID: HZHY-DE-99201928
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
              COMMERCIAL INVOICE
            </span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">
              #{order.orderNumber}
            </p>
            <p className="text-[11px] text-slate-500">Date: {order.date}</p>
            <p className="text-[11px] text-slate-500">Payment Due: {order.dueDate}</p>
          </div>
        </div>

        {/* Customer & Order Metadata */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Billed To
            </p>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {order.customerName}
            </h4>
            <p className="text-slate-500">{order.customerEmail}</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Payment Status & Terms
            </p>
            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {order.paymentStatus.toUpperCase()}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Order Status: {order.status}</p>
            <p className="text-[11px] text-slate-500">Sales Officer: {order.createdByName}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.sku}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center font-bold">{item.quantity}</td>
                  <td className="p-3 text-right">${item.unitPrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold">${item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-right">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white">${order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Discount Applied:</span>
              <span className="font-semibold text-rose-500">-${order.discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (10% VAT):</span>
              <span className="font-semibold text-slate-900 dark:text-white">${order.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="text-blue-600 dark:text-blue-400">${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Bank Instructions Footer */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">Bank Transfer Details:</p>
          <p>Bank Name: Deutsche Commerce Bank • IBAN: DE89 3704 0044 0532 0112 00</p>
          <p>SWIFT/BIC: DEUTDEDBDXX • Reference: #{order.orderNumber}</p>
        </div>
      </div>
    </Modal>
  );
};

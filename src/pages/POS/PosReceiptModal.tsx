import React from 'react';
import { PosSale } from '../../types/pos';
import { Tenant } from '../../types';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface PosReceiptModalProps {
  sale: PosSale;
  tenant: Tenant;
  onClose: () => void;
  onNewSale?: () => void;
}

export const PosReceiptModal: React.FC<PosReceiptModalProps> = ({
  sale,
  tenant,
  onClose,
  onNewSale
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(sale.createdAt).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="Close receipt"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Printable Receipt Paper Container */}
        <div id="printable-pos-receipt" className="space-y-4 font-mono text-xs text-slate-800">
          {/* Success Check Banner */}
          <div className="flex flex-col items-center justify-center text-center pb-2 border-b border-dashed border-slate-300">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900 uppercase tracking-tight">
              {tenant.name || 'DAVETECH ERP'}
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              {tenant.address || 'Nairobi, Kenya'} • {tenant.phone || '+254 700 000 000'}
            </p>
            <p className="text-[10px] text-indigo-600 font-sans font-semibold mt-0.5">
              DAVETECH MULTI-TENANT POS
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-1 text-[11px] pb-2 border-b border-dashed border-slate-300">
            <div>
              <span className="text-slate-500">Receipt:</span>{' '}
              <span className="font-bold text-slate-900">{sale.saleNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Date:</span> {formattedDate}
            </div>
            <div>
              <span className="text-slate-500">Cashier:</span>{' '}
              <span className="font-semibold text-slate-900">{sale.cashierName}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Pay:</span>{' '}
              <span className="font-bold text-emerald-600">{sale.paymentMethod}</span>
              {sale.paymentRef && <span className="block text-[9px] text-slate-500">Ref: {sale.paymentRef}</span>}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <div className="flex justify-between font-bold border-b border-slate-200 pb-1 text-slate-700">
              <span>ITEM</span>
              <span className="w-12 text-center">QTY</span>
              <span className="w-16 text-right">PRICE</span>
              <span className="w-16 text-right">TOTAL</span>
            </div>
            <div className="divide-y divide-slate-100 py-1 max-h-48 overflow-y-auto">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1 text-[11px]">
                  <span className="truncate pr-1 text-slate-900 font-medium">{item.productName}</span>
                  <span className="w-12 text-center text-slate-600">{item.quantity}</span>
                  <span className="w-16 text-right text-slate-600">{item.unitPrice.toLocaleString()}</span>
                  <span className="w-16 text-right font-bold text-slate-900">{item.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Total Items:</span>
              <span className="font-bold text-slate-900">{sale.totalQuantity}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1">
              <span>TOTAL (KES):</span>
              <span className="text-emerald-700 text-base">KES {sale.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-dashed border-slate-300">
            <p className="font-semibold text-slate-700">Thank you for your patronage!</p>
            <p>Goods once sold are not returnable without valid receipt.</p>
            <p className="text-[9px] text-slate-400 mt-1">Powered by Davetech Multi-Tenant Cloud ERP</p>
          </div>
        </div>

        {/* Action Buttons (Excluded from print via screen css) */}
        <div className="mt-6 flex flex-col gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
          {onNewSale && (
            <button
              onClick={() => {
                onClose();
                onNewSale();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-500 transition-colors"
            >
              Start Next Sale
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

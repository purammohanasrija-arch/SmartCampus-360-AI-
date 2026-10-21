import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  Printer, 
  Download, 
  ShieldCheck, 
  Sparkles,
  DollarSign,
  X
} from 'lucide-react';
import { FeeRecord, FeeTransaction, Student, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';
import { TiltCard, ParallaxLayer } from '../common/TiltCard';

interface FeesFinanceModuleProps {
  currentUser: User;
  currentStudent: Student;
}

export function FeesFinanceModule({ currentUser, currentStudent }: FeesFinanceModuleProps) {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<FeeTransaction | null>(null);
  const [payAmount, setPayAmount] = useState<number>(1000);
  const [payMethod, setPayMethod] = useState('Online ACH Wire');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const res = await apiClient.getFees();
      setFees(res.fees);
    } catch (err) {
      console.error(err);
    }
  };

  const currentFee = fees.find(f => f.studentId === currentStudent.studentId) || fees[0];

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFee) return;

    setIsProcessing(true);
    try {
      const res = await apiClient.payFee(currentFee.studentId, payAmount, payMethod);
      if (res.success) {
        setIsPayModalOpen(false);
        loadFees();
        setSelectedTxForReceipt(res.transaction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Bursar</span>
            <span aria-hidden="true">·</span>
            <span>Fees, Grants & Financial Records</span>
            <span aria-hidden="true">·</span>
            <span>Verified Server Receipts</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Student Financials & Fee Settlement</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Transparent breakdown of tuition, lab fees, campus amenities, scholarships, and verified digital payment invoices.
          </p>
        </div>

        {currentFee && currentFee.balanceDue > 0 && (
          <button
            onClick={() => { setPayAmount(currentFee.balanceDue); setIsPayModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Make Fee Payment</span>
          </button>
        )}
      </div>

      {/* Primary KPI Strip with 3D Parallax Depth */}
      {currentFee && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <TiltCard maxTilt={8} glare={true} className="rounded-2xl">
            <div className="bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-1 shadow-md h-full backdrop-blur-sm">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Total Semester Obligation</span>
              </ParallaxLayer>
              <ParallaxLayer z={24}>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  ${currentFee.totalFee.toLocaleString()}
                </div>
              </ParallaxLayer>
              <ParallaxLayer z={14}>
                <span className="text-[11px] text-slate-400 font-mono">Academic Year {currentFee.academicYear}</span>
              </ParallaxLayer>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glare={true} className="rounded-2xl">
            <div className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 space-y-1 shadow-md h-full backdrop-blur-sm">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Paid to Date</span>
              </ParallaxLayer>
              <ParallaxLayer z={24}>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                  ${currentFee.paidAmount.toLocaleString()}
                </div>
              </ParallaxLayer>
              <ParallaxLayer z={14}>
                <span className="text-[11px] text-emerald-400 font-mono">Settled via Electronic Transfer</span>
              </ParallaxLayer>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} glare={true} className="rounded-2xl">
            <div className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 space-y-1 shadow-md h-full backdrop-blur-sm">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Outstanding Balance Due</span>
              </ParallaxLayer>
              <ParallaxLayer z={24}>
                <div className={`text-3xl font-extrabold font-mono tabular-nums ${currentFee.balanceDue > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  ${currentFee.balanceDue.toLocaleString()}
                </div>
              </ParallaxLayer>
              <ParallaxLayer z={14}>
                <span className="text-[11px] text-slate-400 font-mono">Due Date: {currentFee.dueDate}</span>
              </ParallaxLayer>
            </div>
          </TiltCard>
        </div>
      )}

      {/* Transaction History Ledger */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-400" />
            Verified Payment Transactions & Invoices
          </h3>
          <span className="text-xs text-slate-400 font-mono">Cryptographically Audited</span>
        </div>

        {currentFee && currentFee.transactions.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {currentFee.transactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs">{tx.receiptNumber}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{tx.method} · {tx.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-white text-sm font-mono tabular-nums">${tx.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Verified</div>
                  </div>
                  <button
                    onClick={() => setSelectedTxForReceipt(tx)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition-colors"
                    title="View & Print Official Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No verified payment transactions recorded.</p>
        )}
      </div>

      {/* Payment Processing Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                Process University Fee Remittance
              </h3>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Payment Amount ($) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  max={currentFee.balanceDue}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Payment Gateway Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="Instant Campus Wire">Instant Campus Wire (0% fee)</option>
                  <option value="Online ACH Direct Debit">Online ACH Direct Debit</option>
                  <option value="Campus Bursar Card">Campus Bursar Card</option>
                </select>
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-1 text-slate-300">
                <span className="text-purple-300 font-semibold block">Server-Side Verified Payment:</span>
                <p className="text-[11px] text-slate-400">
                  Transactions are logged directly to the university fiscal database with an immediate downloadable receipt.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-md"
                >
                  {isProcessing ? 'Verifying with Bank...' : `Pay $${payAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedTxForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Official Fee Payment Receipt
              </h3>
              <button onClick={() => setSelectedTxForReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
              <div className="text-center border-b border-slate-800 pb-3 space-y-0.5">
                <h4 className="font-bold text-white uppercase tracking-wider text-sm">SmartCampus 360 University</h4>
                <p className="text-slate-400 text-[10px]">Bursar & Treasury Office</p>
                <span className="text-purple-400 font-bold block pt-1">{selectedTxForReceipt.receiptNumber}</span>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate:</span>
                  <span className="text-white font-semibold">{currentStudent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="text-purple-300">{currentStudent.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span>{selectedTxForReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date Logged:</span>
                  <span>{selectedTxForReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span>{selectedTxForReceipt.method}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Amount Settled:</span>
                  <span className="text-emerald-400">${selectedTxForReceipt.amount.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

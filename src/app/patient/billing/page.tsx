"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";

export default function PatientBilling() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const patientId = (session?.user as any)?.patientId;
    if (patientId) {
      fetch(`/api/invoices?patientId=${patientId}`)
        .then((r) => r.json())
        .then(setInvoices)
        .catch(() => setInvoices([]));
    }
  }, [session]);

  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const totalUnpaid = invoices.filter((i) => i.status === "UNPAID").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Billing</h2>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">Total Billed</div>
          <div className="text-2xl font-bold text-slate-900">
            ${(totalPaid + totalUnpaid).toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">Paid</div>
          <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">Outstanding</div>
          <div className="text-2xl font-bold text-amber-600">${totalUnpaid.toFixed(2)}</div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Invoices</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No invoices yet
            </div>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  inv.status === "PAID" ? "bg-green-50" : "bg-amber-50"
                }`}>
                  {inv.status === "PAID" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-900">
                    {inv.description || "Invoice"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(inv.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">${inv.amount.toFixed(2)}</div>
                  <span className={`text-xs font-medium ${
                    inv.status === "PAID" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

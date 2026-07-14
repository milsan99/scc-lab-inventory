"use client";
import { useState } from "react";
import { BorrowRecord } from "@prisma/client";

export default function BorrowManager({ deviceId, initialBorrows }: { deviceId: string, initialBorrows: BorrowRecord[] }) {
  const [borrows, setBorrows] = useState(initialBorrows);
  const [borrowerName, setBorrowerName] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/devices/${deviceId}/borrow`, {
      method: "POST",
      body: JSON.stringify({ borrowerName, expectedReturnDate })
    });
    if (res.ok) {
      const newBorrow = await res.json();
      setBorrows([newBorrow, ...borrows]);
      setBorrowerName("");
      setExpectedReturnDate("");
    }
  };

  const handleReturn = async (borrowId: string) => {
    const res = await fetch(`/api/devices/${deviceId}/borrow/${borrowId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Returned" })
    });
    if (res.ok) {
      const updated = await res.json();
      setBorrows(borrows.map(b => b.id === updated.id ? updated : b));
    }
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Borrowing Interface</h2>
      <form onSubmit={handleBorrow} className="space-y-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
        <div>
          <label className="text-sm text-slate-300">Borrower Name</label>
          <input required type="text" className="input-style mt-1" value={borrowerName} onChange={e => setBorrowerName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-300">Expected Return Date</label>
          <input required type="date" className="input-style mt-1" value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary w-full py-2">Issue Item</button>
      </form>
      
      <div className="space-y-2 mt-4">
        {borrows.map(b => (
          <div key={b.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex justify-between items-center">
            <div>
              <p className="text-white font-medium">{b.borrowerName}</p>
              <p className="text-xs text-slate-400">Due: {new Date(b.expectedReturnDate).toLocaleDateString()}</p>
            </div>
            {b.status === "Active" ? (
              <button onClick={() => handleReturn(b.id)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white">Return</button>
            ) : (
              <span className="px-3 py-1 bg-slate-700 rounded text-xs text-slate-300">Returned</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

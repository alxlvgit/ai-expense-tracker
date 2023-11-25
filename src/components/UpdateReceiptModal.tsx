"use client";

import { updateReceipt } from "@/app/expenses/receipt/actions";
import { Receipt } from "@/db/queries/allReceipts";
import { useState } from "react";

export default function UpdateReceiptModal({
  isOpen,
  receipt,
  setEditModalClosed,
}: {
  isOpen: boolean;
  receipt: Receipt;
  setEditModalClosed: () => void;
}) {
  const [receiptDate, setReceiptDate] = useState<string>(receipt.receiptDate);
  const [receiptTotal, setReceiptTotal] = useState<string>(
    receipt.receiptTotal
  );
  const [receiptCategory, setReceiptCategory] = useState<string>(
    receipt.receiptCategory
  );
  const handleReceiptUpdate = async (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      if (!receiptDate || !receiptTotal || !receiptCategory) {
        console.error("Missing required fields");
        setEditModalClosed();
        return;
      }

      await updateReceipt({
        receiptId: receipt.id,
        receiptDate,
        receiptTotal,
        receiptCategory,
      });

      setEditModalClosed();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`fixed z-50 inset-0 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex m-auto mt-10 bg-white flex-col justify-center w-1/2 gap-5 rounded-lg border p-8 ">
        <div className="flex justify-end">
          <button
            onClick={setEditModalClosed}
            className="text-white rounded-md px-3 py-1 w-fit bg-red-500 hover:bg-red-600"
          >
            X
          </button>
        </div>
        <form className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="receiptDate">
            Receipt Date
          </label>
          <input
            className="block w-full py-2 px-3 border-none bg-gray-100  h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            type="date"
            name="receiptDate"
            id="receiptDate"
            value={receiptDate}
            onChange={(event) => setReceiptDate(event.target.value)}
          />
          <label className="text-sm mt-2 font-medium" htmlFor="receiptTotal">
            Receipt Total
          </label>
          <input
            className="block w-full py-2 px-3 border-none bg-gray-100  h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            type="number"
            name="receiptTotal"
            id="receiptTotal"
            value={receiptTotal}
            onChange={(event) => setReceiptTotal(event.target.value)}
          />
          <label className="text-sm mt-2 font-medium" htmlFor="receiptCategory">
            Receipt Category
          </label>
          <input
            className=" block w-full py-2 px-3 border-none bg-gray-100  h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            type="text"
            name="receiptCategory"
            id="receiptCategory"
            value={receiptCategory}
            onChange={(event) => setReceiptCategory(event.target.value)}
          />
        </form>
        <div className="flex justify-start w-full">
          <button
            onClick={handleReceiptUpdate}
            className="bg-blue-800 w-fit text-white rounded-md px-5 py-2 hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

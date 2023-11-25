"use client";

import { Receipt } from "@/db/queries/allReceipts";
import ReceiptContainer from "./ReceiptContainer";
import { useState } from "react";
import UpdateReceiptModal from "./UpdateReceiptModal";

export const Receipts = ({ receipts }: { receipts: Receipt[] }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-3">
        {receipts.map((receipt) => (
          <ReceiptContainer
            key={receipt.id}
            receipt={receipt}
            setEditModalOpen={() => {
              setReceipt(receipt);
              openModal();
            }}
          />
        ))}
      </div>

      {receipt && (
        <UpdateReceiptModal
          isOpen={isModalOpen}
          receipt={receipt}
          setEditModalClosed={() => {
            setReceipt(null);
            closeModal();
          }}
        />
      )}
    </>
  );
};

import Link from "next/link";
import Image from "next/image";
import { Receipt } from "@/db/queries/allReceipts";
import { deleteReceipt } from "@/app/expenses/actions";

export default function ReceiptContainer({
  receipt,
  setEditModalOpen,
}: {
  receipt: Receipt;
  setEditModalOpen: () => void;
}) {
  const handleDelete = async () => {
    try {
      await deleteReceipt(receipt.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      key={receipt.id}
      className="m-auto md:m-0 w-full p-5 border grid lg:grid-cols-2 grid-cols-1 gap-3 shadow-lg border-gray-300 items-center justify-center rounded-xl"
    >
      <div className="flex w-full h-full flex-col gap-2 text-xs font-medium text-gray-700">
        <p className="col-span-2 text-gray-500 mb-6">
          Date Added: {receipt.dateAdded.toLocaleDateString("en-US")}
        </p>
        <h2>Receipt Date: {receipt.receiptDate}</h2>
        <p>Total: ${receipt.receiptTotal}</p>
        <p>Category: {receipt.receiptCategory}</p>
      </div>

      <div className="flex justify-center col-span-2 lg:col-span-1 items-center w-full h-full relative">
        <Link
          href={receipt.media!.url}
          className=" w-72 h-72 md:w-52 md:h-52 lg:w-full relative lg:h-full overflow-hidden rounded-lg "
        >
          <div className="absolute flex justify-center items-center z-20 bg-black opacity-20 hover:opacity-70 w-full h-full group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-white group-hover:opacity-100 opacity-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </div>

          <Image
            src={receipt.media!.url}
            alt="Receipt"
            fill={true}
            className="object-cover w-full h-full"
          />
        </Link>
      </div>
      <div className="col-span-2 flex justify-between w-full">
        <button
          onClick={() => {
            setEditModalOpen();
          }}
          className="rounded-xl text-xs mt-5 bg-blue-800 text-white text-center px-7 py-2 hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => {
            handleDelete();
          }}
          className="rounded-xl text-xs mt-5 bg-black text-white text-center px-3 py-2 hover:bg-gray-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

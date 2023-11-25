import Link from "next/link";
import Image from "next/image";
import { Receipt } from "@/db/queries/allReceipts";

export default function ReceiptContainer({
  receipt,
  setEditModalOpen,
}: {
  receipt: Receipt;
  setEditModalOpen: () => void;
}) {
  return (
    <div
      key={receipt.id}
      className="m-auto md:m-0 w-full p-5 border grid lg:grid-cols-2 grid-cols-1 gap-3 shadow-lg border-gray-300 items-center justify-center rounded-xl"
    >
      <div className="flex w-full h-full flex-col gap-2 text-xs font-medium text-gray-700">
        <p className="col-span-2 text-gray-500 mb-6">
          Date Added: {receipt.dateAdded.toLocaleDateString("en-US")}
        </p>
        <h2>
          Receipt Date:{" "}
          {new Date(receipt.receiptDate).toLocaleDateString("en-US", {
            timeZone: "UTC",
          })}
        </h2>
        <p>Total: ${receipt.receiptTotal}</p>
        <p>Category: {receipt.receiptCategory}</p>
      </div>

      <div className="flex justify-center col-span-2 lg:col-span-1 items-center w-full h-full relative">
        <Link
          href={receipt.media!.url}
          className=" w-72 h-72 md:w-52 md:h-52 lg:w-full lg:h-full overflow-hidden rounded-lg brightness-90 hover:brightness-50 "
        >
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

        <button className="rounded-xl text-xs mt-5 bg-black text-white text-center px-3 py-2 hover:bg-gray-600">
          Delete
        </button>
      </div>
    </div>
  );
}

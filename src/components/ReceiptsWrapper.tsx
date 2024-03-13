import { receiptsForUser } from "@/db/queries/allReceipts";
import { Receipts } from "./Receipts";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export default async function ReceiptsWrapper({ userId }: { userId: string }) {
  const receipts = await receiptsForUser.execute({ userId });

  // Format the date of the receipts
  receipts.map((receipt) => {
    receipt.receiptDate = new Date(receipt.receiptDate).toLocaleDateString(
      "en-US",
      {
        timeZone: "UTC",
      }
    );
    const formattedDateAdded = format(receipt.dateAdded, "MM/dd/yyyy", {
      locale: enUS,
    });
    receipt.dateAdded = new Date(formattedDateAdded);

    return receipt;
  });

  return (
    <div className="">
      {receipts.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No receipts uploaded yet
        </p>
      ) : (
        <Receipts receipts={receipts} />
      )}
    </div>
  );
}

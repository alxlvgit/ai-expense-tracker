import { receiptsForUser } from "@/db/queries/allReceipts";
import { Receipts } from "./Receipts";
import { format } from "date-fns";
import { enUS, eu } from "date-fns/locale";

export default async function ReceiptsWrapper({ userId }: { userId: string }) {
  const receipts = await receiptsForUser.execute({ userId });

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

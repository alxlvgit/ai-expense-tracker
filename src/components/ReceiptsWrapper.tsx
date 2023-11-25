import { receiptsForUser } from "@/db/queries/allReceipts";
import { Receipts } from "./Receipts";

export default async function ReceiptsWrapper({ userId }: { userId: string }) {
  const receipts = await receiptsForUser.execute({ userId });

  return (
    <div className="">
      <Receipts receipts={receipts} />
    </div>
  );
}

import { receiptsQuery } from "@/db/queries/allReceipts";
import Image from "next/image";
import Link from "next/link";

export default async function Receipts() {
  const receipts = await receiptsQuery.execute();
  return (
    <>
      {receipts.map((receipt) => (
        <div key={receipt.id}>
          <h2>
            Receipt Date:{" "}
            {new Date(receipt.receiptDate).toLocaleDateString("en-US", {
              timeZone: "UTC",
            })}
          </h2>
          <p>Date Added: {receipt.dateAdded.toLocaleDateString("en-US")}</p>
          <p>Total: ${receipt.receiptTotal}</p>
          <p>Category: {receipt.receiptCategory}</p>
          <Link href={receipt.media!.url}>
            <Image
              src={receipt.media!.url}
              alt="Receipt"
              width={300}
              height={300}
            />
          </Link>
        </div>
      ))}
    </>
  );
}

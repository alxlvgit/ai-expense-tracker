"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { receipts as receiptsTable } from "@/db/schema";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UpdateReceiptParams = {
  receiptId: number;
  receiptDate: string;
  receiptCategory: string;
  receiptTotal: string;
};

type UpdateReceiptResult =
  | { success: { receipt: { id: number } } }
  | { failure: string };

export const updateReceipt = async ({
  receiptId,
  receiptDate,
  receiptCategory,
  receiptTotal,
}: UpdateReceiptParams): Promise<UpdateReceiptResult> => {
  try {
    // check if user is authenticated
    const session = await auth();
    if (!session) {
      return { failure: "not authenticated" };
    }
    // get the user id
    const userId = session.user.id;

    // update the receipt in the database
    const updatedReceipt = await db
      .update(receiptsTable)
      .set({
        receiptCategory,
        receiptDate,
        receiptTotal,
      })
      .where(
        and(eq(receiptsTable.id, receiptId), eq(receiptsTable.userId, userId))
      )
      .returning();

    revalidatePath("/expenses");
    return { success: { receipt: updatedReceipt[0] } };
  } catch (e) {
    return { failure: "receipt not updated" };
  }
};

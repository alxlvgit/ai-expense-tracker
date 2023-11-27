"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { receipts as receiptsTable } from "@/db/schema";
import { media as mediaTable } from "@/db/schema";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

export const deleteReceipt = async (receiptId: number) => {
  try {
    const deleteMedia = await db
      .delete(mediaTable)
      .where(eq(mediaTable.receiptId, receiptId))
      .returning()
      .then((res) => res[0]);

    await db
      .delete(receiptsTable)
      .where(eq(receiptsTable.id, receiptId))
      .returning();

    if (deleteMedia) {
      const url = deleteMedia.url;
      const key = url.split("/").slice(-1)[0];

      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }
    revalidatePath("/expenses");
  } catch (e) {
    console.error(e);
  }
};

"use server";

import { auth } from "@/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/db";
import { media as mediaTable, receipts as receiptsTable } from "@/db/schema";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const allowedFileTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1048576 * 10; // 1 MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

type SignedURLResponse = Promise<
  | { failure?: undefined; success: { url: string; fileId: number } }
  | { failure: string; success?: undefined }
>;

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

// Get a signed URL for uploading a file to S3
export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams): SignedURLResponse => {
  const session = await auth();

  if (!session) {
    return { failure: "not authenticated" };
  }

  if (!allowedFileTypes.includes(fileType)) {
    return { failure: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { failure: "File size too large" };
  }

  const fileName = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  console.log({ success: url });

  const addedMedia = await db
    .insert(mediaTable)
    .values({
      url: url.split("?")[0],
      width: 0,
      height: 0,
      userId: session.user.id,
    })
    .returning();

  return { success: { url, fileId: addedMedia[0].id } };
};

type AddReceiptParams = {
  fileId: number;
  receiptDate: string;
  receiptCategory: string;
  receiptTotal: string;
};

export const addReceipt = async ({
  fileId,
  receiptDate,
  receiptCategory,
  receiptTotal,
}: AddReceiptParams): Promise<{ failure: string } | undefined> => {
  try {
    // check if user is authenticated
    const session = await auth();
    if (!session) {
      return { failure: "not authenticated" };
    }
    // get the user id
    const userId = session.user.id;
    // get the file from the database
    if (fileId) {
      const file = await db
        .select({
          id: mediaTable.id,
        })
        .from(mediaTable)
        .where(and(eq(mediaTable.id, fileId), eq(mediaTable.userId, userId)))
        .then((rows) => rows[0]);

      if (!file) {
        return { failure: "receipt image not found" };
      }
    }

    // add the receipt to the database
    const addedReceipt = await db
      .insert(receiptsTable)
      .values({
        userId,
        receiptCategory,
        receiptDate,
        receiptTotal,
      })
      .returning();

    if (fileId) {
      // update the file to reference the receipt
      await db
        .update(mediaTable)
        .set({ receiptId: addedReceipt[0].id })
        .where(eq(mediaTable.id, fileId));
    }
    revalidatePath("/expenses");
    redirect("/expenses");
    return;
  } catch (error) {
    console.error(error);
    return { failure: "error adding receipt" };
  }
};

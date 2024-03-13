"use client";

import Image from "next/image";
import { useState } from "react";
import { addReceipt, getSignedURL } from "@/app/actions";
import { twMerge } from "tailwind-merge";
import { imageToText, textToObject } from "@/app/image-to-text";

export default function UploadReceiptForm({
  user,
}: {
  user: { name?: string | null; image?: string | null };
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const computeSHA256 = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const base64String = Buffer.from(bytes).toString("base64");
    return { checksum: hashHex, base64String };
  };

  const storeUploadedFile = async (file: File, checksum: string) => {
    const signedURLResult = await getSignedURL({
      fileSize: file.size,
      fileType: file.type,
      checksum,
    });
    if (signedURLResult.failure !== undefined) {
      throw new Error(signedURLResult.failure);
    }
    const { url, fileId } = signedURLResult.success;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const fileUrl = url.split("?")[0];
    return { fileUrl, fileId };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (file) {
        setStatusMessage("Uploading receipt...");
        const { checksum, base64String } = await computeSHA256(file);
        setStatusMessage("Reading data from receipt...");
        const receiptText = await imageToText(base64String);
        if (receiptText.failure) {
          throw new Error(receiptText.failure);
        }
        const receiptData = await textToObject(receiptText.success!);
        if (receiptData.failure) {
          throw new Error(receiptData.failure);
        }
        const receipt = receiptData.success!;
        setStatusMessage("Adding receipt to database...");
        const fileStored = await storeUploadedFile(file, checksum);
        const receiptAddedToDb = await addReceipt({
          fileId: fileStored.fileId,
          receiptDate: receipt.date,
          receiptCategory: receipt.category,
          receiptTotal: `${receipt.total}`,
        });
        if (receiptAddedToDb?.failure) {
          throw new Error(receiptAddedToDb.failure);
        }
        setStatusMessage("Receipt added successfully");
        setFile(null);
      } else {
        setStatusMessage("No file selected");
        return;
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Error uploading receipt");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setStatusMessage("");
    setPreviewUrl(null);
    setFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <form
        className="w-full m-auto border border-gray-200 flex flex-col items-center  shadow-lg rounded-lg px-6 py-6"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 flex-col items-center justify-center p-6 w-full">
          <div className="flex flex-col items-center w-full">
            <label className="flex justify-center">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 hover:cursor-pointer transform-gpu active:scale-75 transition-all fill-blue-700 hover:fill-blue-400"
              >
                <rect x="0" fill="none" width="24" height="24" />

                <g>
                  <path d="M23 4v2h-3v3h-2V6h-3V4h3V1h2v3h3zm-8.5 7c.828 0 1.5-.672 1.5-1.5S15.328 8 14.5 8 13 8.672 13 9.5s.672 1.5 1.5 1.5zm3.5 3.234l-.513-.57c-.794-.885-2.18-.885-2.976 0l-.655.73L9 9l-3 3.333V6h7V4H6c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2v-7h-2v3.234z" />
                </g>
              </svg>

              <input
                className="bg-black flex-1 border-none outline-none hidden"
                name="receipt"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
              />
            </label>
            <p className="font-bold text-xs">Click to add receipt</p>
            {previewUrl && file && (
              <div className="mt-4 rounded-lg relative overflow-hidden">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={previewUrl}
                    alt="Selected file"
                    width={200}
                    height={200}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>

        {statusMessage && (
          <p className="bg-blue-500 border border-blue-800 text-center rounded-lg text-sm w-full text-white px-4 py-2 mt-8 relative">
            {statusMessage}
          </p>
        )}

        <div className="flex justify-center w-full items-center mt-8">
          <button
            className={twMerge(
              "border rounded-xl px-10 bg-blue-700 text-white font-bold  hover:bg-blue-500  py-2 disabled",
              loading && "opacity-50 cursor-not-allowed"
            )}
            aria-disabled={loading}
            disabled={loading}
            type="submit"
          >
            Add Expense
          </button>
        </div>
      </form>
    </>
  );
}

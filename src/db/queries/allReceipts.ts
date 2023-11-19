import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { receipts as receiptsTable } from "../schema";
import { users as usersTable } from "../schema";
import { media as mediaTable } from "../schema";

const baseQuery = db
  .select({
    id: receiptsTable.id,
    dateAdded: receiptsTable.dateAdded,
    receiptDate: receiptsTable.receiptDate,
    receiptTotal: receiptsTable.receiptTotal,
    receiptCategory: receiptsTable.receiptCategory,
    user: {
      id: usersTable.id,
      name: usersTable.name,
      image: usersTable.image,
    },
    media: {
      id: mediaTable.id,
      url: mediaTable.url,
      width: mediaTable.width,
      height: mediaTable.height,
    },
  })
  .from(receiptsTable)
  .innerJoin(usersTable, eq(usersTable.id, receiptsTable.userId))
  .leftJoin(mediaTable, eq(mediaTable.receiptId, receiptsTable.id));

export const receiptsQuery = baseQuery
  .orderBy(desc(receiptsTable.dateAdded))
  .prepare("receipts_for_user");

export type Receipt = Awaited<ReturnType<typeof receiptsQuery.execute>>[0];

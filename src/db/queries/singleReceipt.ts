import { eq, sql } from "drizzle-orm";
import { db } from "../index";
import { receipts as receiptsTable } from "../schema";
import { users as usersTable } from "../schema";
import { media as mediaTable } from "../schema";

export const singleReceiptQuery = db
  .select({
    id: receiptsTable.id,
    dateAdded: receiptsTable.dateAdded,
    receiptDate: receiptsTable.receiptDate,
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
  .leftJoin(mediaTable, eq(mediaTable.receiptId, receiptsTable.id))
  .where(eq(receiptsTable.id, sql.placeholder("id")))
  .limit(1)
  .prepare("single_receipt");

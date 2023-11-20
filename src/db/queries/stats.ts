import { eq, sql } from "drizzle-orm";
import { db } from "../index";
import { receipts as receiptsTable } from "../schema";

export const receiptsTotalForUser = db
  .select({
    total: sql<number>`sum (${receiptsTable.receiptTotal})`,
  })
  .from(receiptsTable)
  .where(eq(receiptsTable.userId, sql.placeholder("userId")))
  .prepare("receipts_total_for_user");

export const receiptsTotalForUserByCategory = db
  .select({
    total: sql<number>`sum (${receiptsTable.receiptTotal})`,
    category: receiptsTable.receiptCategory,
  })
  .from(receiptsTable)
  .where(eq(receiptsTable.userId, sql.placeholder("userId")))
  .groupBy(receiptsTable.receiptCategory)
  .prepare("receipts_total_for_user_by_category");

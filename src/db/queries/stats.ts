import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../index";
import { receipts as receiptsTable } from "../schema";

export const allTimeReceiptsTotalForUser = db
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

export const receiptsTotalForUserByMonthYear = db
  .select({
    totalForMonth: sql<number>`sum (${receiptsTable.receiptTotal})`,
  })
  .from(receiptsTable)
  .where(
    and(
      eq(receiptsTable.userId, sql.placeholder("userId")),
      eq(
        sql<number>`extract(year from ${receiptsTable.receiptDate})`,
        sql.placeholder("receiptYear")
      ),
      eq(
        sql<number>`extract(month from ${receiptsTable.receiptDate})`,
        sql.placeholder("receiptMonth")
      )
    )
  )
  .groupBy(
    sql<number>`extract(year from ${receiptsTable.receiptDate})`,
    sql<number>`extract(month from ${receiptsTable.receiptDate})`
  )
  .prepare("receipts_total_for_user_by_month");

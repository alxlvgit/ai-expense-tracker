import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../index";
import { receipts as receiptsTable } from "../schema";

// Get all time receipts total for a user
export const allTimeReceiptsTotalForUser = db
  .select({
    total: sql<number>`sum (${receiptsTable.receiptTotal})`,
  })
  .from(receiptsTable)
  .where(eq(receiptsTable.userId, sql.placeholder("userId")))
  .prepare("receipts_total_for_user");

// Get the total expenses for three highest categories
export const threeHighestExpensesByCategory = db
  .select({
    total: sql<number>`sum (${receiptsTable.receiptTotal})`,
    category: receiptsTable.receiptCategory,
  })
  .from(receiptsTable)
  .where(eq(receiptsTable.userId, sql.placeholder("userId")))
  .groupBy(receiptsTable.receiptCategory)
  .orderBy(desc(sql<number>`sum (${receiptsTable.receiptTotal})`))
  .limit(3)
  .prepare("receipts_total_for_user_by_category");

// Get the expenses for three categories for month/year ordered by day of month
export const threeRecentExpensesByCategory = db
  .select({
    total: sql<number>`sum (${receiptsTable.receiptTotal})`,
    category: receiptsTable.receiptCategory,
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
  .groupBy(receiptsTable.receiptCategory, receiptsTable.receiptDate)
  .orderBy(desc(sql<number>`extract(day from ${receiptsTable.receiptDate})`))
  .limit(3)
  .prepare("receipts_total_for_user_by_category_by_month");

// Get the total expenses for month/year
export const totalExpensesByMonthYear = db
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

// Get all expenses for a year and group by month
export const totalExpensesByYear = db
  .select({
    total: sql<number>`sum (${receiptsTable.receiptTotal})`,
    month: sql<number>`extract(month from ${receiptsTable.receiptDate})`,
  })
  .from(receiptsTable)
  .where(
    and(
      eq(receiptsTable.userId, sql.placeholder("userId")),
      eq(
        sql<number>`extract(year from ${receiptsTable.receiptDate})`,
        sql.placeholder("receiptYear")
      )
    )
  )
  .groupBy(
    sql<number>`extract(year from ${receiptsTable.receiptDate})`,
    sql<number>`extract(month from ${receiptsTable.receiptDate})`
  )
  .orderBy(asc(sql<number>`extract(month from ${receiptsTable.receiptDate})`))
  .prepare("receipts_total_for_user_by_year");

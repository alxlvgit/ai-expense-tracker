import { auth } from "@/auth";
import CurrentDateTime from "@/components/CurrentDateTime";
import ExpensesStats from "@/components/ExpensesStats";
import TotalForMonth from "@/components/TotalForMonth";
import UploadReceiptForm from "@/components/UploadReceiptForm";
import {
  threeHighestExpensesByCategory,
  threeRecentExpensesByCategory,
  totalExpensesByMonthYear,
} from "@/db/queries/stats";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  const { user } = session;

  const totalForCurrentMonth = await totalExpensesByMonthYear.execute({
    userId: user.id,
    receiptMonth: new Date().getMonth() + 1,
    receiptYear: new Date().getFullYear(),
  });

  const threeTopExpenses = await threeHighestExpensesByCategory.execute({
    userId: user.id,
  });
  threeTopExpenses.forEach((category) => {
    category.category =
      category.category.charAt(0).toUpperCase() + category.category.slice(1);
  });

  const threeRecentExpenses = await threeRecentExpensesByCategory.execute({
    userId: user.id,
    receiptYear: new Date().getFullYear(),
    receiptMonth: new Date().getMonth() + 1,
  });
  threeRecentExpenses.forEach((category) => {
    category.category =
      category.category.charAt(0).toUpperCase() + category.category.slice(1);
  });

  return (
    <main className="flex min-h-screen flex-col w-full px-6  sm:px-20 py-16">
      <h1 className="font-bold text-lg">Welcome, {user.name}!</h1>
      <CurrentDateTime initialTime={new Date()} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
        <div className="flex flex-col gap-6">
          <TotalForMonth
            userName={user.name ? user.name : "User"}
            totalForMonth={
              totalForCurrentMonth[0]
                ? `$${totalForCurrentMonth[0].totalForMonth}`
                : "$0"
            }
          />
          <UploadReceiptForm user={user} />
        </div>
        <div className="flex flex-col gap-6">
          <ExpensesStats data={threeTopExpenses} type="topThree" />
          <ExpensesStats type="recent" data={threeRecentExpenses} />
        </div>
      </div>
    </main>
  );
}

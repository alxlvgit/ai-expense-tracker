import { auth } from "@/auth";
import ThreeRecentByCategory from "@/components/ThreeRecentByCategory";
import TopThreeByCategory from "@/components/TopThreeByCategory";
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

  let totalForMonth = "";
  if (totalForCurrentMonth[0]) {
    totalForMonth = `$${totalForCurrentMonth[0].totalForMonth}`;
  } else {
    totalForMonth = "$0";
  }

  const totalAllTimeByCategories = await threeHighestExpensesByCategory.execute(
    {
      userId: user.id,
    }
  );
  totalAllTimeByCategories.forEach((category) => {
    category.category =
      category.category.charAt(0).toUpperCase() + category.category.slice(1);
  });

  const threeRecentByCategories = await threeRecentExpensesByCategory.execute({
    userId: user.id,
    receiptYear: new Date().getFullYear(),
    receiptMonth: new Date().getMonth() + 1,
  });
  threeRecentByCategories.forEach((category) => {
    category.category =
      category.category.charAt(0).toUpperCase() + category.category.slice(1);
  });

  return (
    <main className="flex min-h-screen flex-col w-full px-6  sm:px-20 py-16">
      <h1 className="font-bold text-lg">Welcome, {user.name}!</h1>
      <h2 className="text-xs text-gray-500 mt-1">
        {new Date().toLocaleString("en-US")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
        <div className="flex flex-col gap-6">
          <TotalForMonth
            userName={user.name ? user.name : "User"}
            totalForMonth={totalForMonth}
          />
          <UploadReceiptForm user={user} />
        </div>
        <div className="flex flex-col gap-6">
          <TopThreeByCategory topThreeCategories={totalAllTimeByCategories} />
          <ThreeRecentByCategory
            threeRecentByCategories={threeRecentByCategories}
          />
        </div>
      </div>
    </main>
  );
}

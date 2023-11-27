import { auth } from "@/auth";
import TotalForMonth from "@/components/TotalForMonth";
import UploadReceiptForm from "@/components/UploadReceiptForm";
import { receiptsTotalForUserByMonthYear } from "@/db/queries/stats";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  const { user } = session;
  const totalForCurrentMonth = await receiptsTotalForUserByMonthYear.execute({
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
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-bold">Top Expenses</h3>
            <p className="text-sm font-bold">Category 1</p>
            <p className="text-sm font-bold">Category 2</p>
            <p className="text-sm font-bold">Category 3</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-bold">Recent Expenses</h3>
            <p className="text-sm font-bold">Merchant 1</p>
            <p className="text-sm font-bold">Merchant 2</p>
            <p className="text-sm font-bold">Merchant 3</p>
          </div>
        </div>
      </div>
    </main>
  );
}

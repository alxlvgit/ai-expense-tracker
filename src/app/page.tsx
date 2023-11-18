import { auth } from "@/auth";
import UploadReceiptForm from "@/components/UploadReceiptForm";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  const { user } = session;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">Expense Tracker</h1>
      <UploadReceiptForm user={user} />
    </main>
  );
}

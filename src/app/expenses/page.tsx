import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Receipts from "@/components/Receipts";

export default async function Expenses() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/receipts");
  }
  const { user } = session;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center mb-8">All Receipts</h1>
      <Receipts userId={user.id} />
    </main>
  );
}

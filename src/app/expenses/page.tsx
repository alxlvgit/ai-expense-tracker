import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ReceiptsWrapper from "@/components/ReceiptsWrapper";
import { Suspense } from "react";

export default async function Expenses() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/receipts");
  }
  const { user } = session;

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8 md:p-24">
      <h1 className="text-2xl font-bold text-center mb-8">My Receipts</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ReceiptsWrapper userId={user.id} />
      </Suspense>
    </main>
  );
}

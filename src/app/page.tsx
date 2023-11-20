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
    <main className="flex min-h-screen flex-col w-full justify-between px-20 py-16">
      <h1 className="font-bold text-lg">Welcome, {user.name}!</h1>
      <h2 className="text-xs text-gray-500 mt-1">
        {new Date().toLocaleString("en-US")}
      </h2>
      <UploadReceiptForm user={user} />
    </main>
  );
}

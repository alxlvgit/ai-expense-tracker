import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserProfileWrapper from "./UserProfileWrapper";
import { signOut } from "@/auth";

<HomeIcon className="h-6 w-6 text-gray-500" />;
export default async function Navbar() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }
  const { user } = session;
  const signOutUser = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav
      className="flex justify-evenly sm:justify-start h-full items-center align-middle text-blue-800"
      role="navigation"
    >
      <UserProfileWrapper user={user} signOut={signOutUser} />
      <Link
        className="text-center sm:mx-8  text-xs sm:text-sm font-bold group"
        href="/"
      >
        <div className="flex items-center gap-1">
          <HomeIcon className="h-6 w-6  group-hover:text-blue-400" />
          <p className="group-hover:text-blue-400">Dashboard</p>
        </div>
      </Link>
      <Link
        className="text-center sm:mx-8 text-xs sm:text-sm font-bold group"
        href="/expenses"
      >
        <div className="flex items-center gap-1">
          <CreditCardIcon className="h-6 w-6  group-hover:text-blue-400" />
          <p className="group-hover:text-blue-400">Expenses</p>
        </div>
      </Link>
    </nav>
  );
}

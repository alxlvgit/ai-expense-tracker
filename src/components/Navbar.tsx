import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { CreditCardIcon } from "@heroicons/react/24/outline";

<HomeIcon className="h-6 w-6 text-gray-500" />;
export default async function Navbar() {
  return (
    <nav
      className="flex justify-start h-full items-center align-middle text-blue-800"
      role="navigation"
    >
      <Link className="text-center text-sm font-bold group" href="/">
        <div className="flex items-center gap-1">
          <HomeIcon className="h-6 w-6  group-hover:text-blue-400" />
          <p className="group-hover:text-blue-400">Dashboard</p>
        </div>
      </Link>
      <Link
        className="text-center mx-8 text-sm font-bold group"
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

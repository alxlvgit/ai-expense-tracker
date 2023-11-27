import { User } from "next-auth";
import Image from "next/image";
import SignoutButton from "./SignoutButton";

export default function UserProfileModal({
  user,
  isOpen,
  setModalClosed,
  signOut,
}: {
  user: User;
  isOpen: boolean;
  setModalClosed: () => void;
  signOut: () => Promise<void>;
}) {
  return (
    <div
      className={`fixed z-50 inset-0 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex m-auto mt-10 bg-white flex-col justify-center md:w-1/4 w-4/5 gap-5 rounded-lg border p-8 ">
        <div className="flex justify-end">
          <button
            onClick={setModalClosed}
            className="text-white rounded-md px-3 py-1 w-fit bg-red-500 hover:bg-red-600"
          >
            X
          </button>
        </div>
        <div className="flex justify-center">
          <Image
            className="h-20 w-20 rounded-full object-cover "
            src={user.image ? user.image : "/user.png"}
            alt="user profile"
            width={80}
            height={80}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Name</p>
          <p className="text-sm text-gray-600">{user.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Email</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <SignoutButton
          signOut={async () => {
            await signOut();
            setModalClosed();
          }}
        />
      </div>
    </div>
  );
}

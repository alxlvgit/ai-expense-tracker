"use client";

import { User } from "next-auth";
import Image from "next/image";
import UserProfileModal from "./UserProfileModal";
import { useState } from "react";

export default function UserProfileWrapper({
  user,
  signOut,
}: {
  user: User;
  signOut: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const setModalClosed = () => {
    setIsOpen(false);
  };
  const setModalOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            className="h-9 w-9 rounded-full cursor-pointer object-cover hover:brightness-75"
            src={user.image ? user.image : "/user.png"}
            alt="user profile"
            width={40}
            height={40}
            onClick={() => {
              setModalOpen();
            }}
          />
        </div>
      </div>
      <UserProfileModal
        user={user}
        isOpen={isOpen}
        setModalClosed={setModalClosed}
        signOut={signOut}
      />
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40"></div>}
    </>
  );
}

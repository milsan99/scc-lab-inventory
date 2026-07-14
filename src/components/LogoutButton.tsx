"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="btn-danger w-full"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}

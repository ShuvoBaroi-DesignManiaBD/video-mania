"use client";
import Link from "next/link";
import Avatar from "@/components/ui/avatar";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Upload, Settings, LogOut } from "lucide-react";

export function UserDropdown() {
  return (
    <DropdownMenu
      trigger={
        <div className="flex items-center gap-3">
          <Avatar />
        </div>
      }
    >
      <DropdownItem>
        <Link href="/profile">Profile</Link>
      </DropdownItem>
      <DropdownItem>
        <Link href="/upload" className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload</Link>
      </DropdownItem>
      <DropdownItem>
        <Link href="/settings" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</Link>
      </DropdownItem>
      <DropdownItem>
        <button className="flex w-full items-center gap-2 text-left"><LogOut className="h-4 w-4" /> Logout</button>
      </DropdownItem>
    </DropdownMenu>
  );
}

export default UserDropdown;
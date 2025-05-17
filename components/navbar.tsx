"use client"

import Link from "next/link"
import { Settings } from "lucide-react"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className=" w-full flex items-center justify-between p-4 bg-background">
      <div className="flex items-center">
        <Link href="/" className="text-foreground text-xl font-bold">
          BuildPublic
        </Link>
      </div>
      <div className="flex items-center space-x-2">
      <Link href="/dashboard" className="text-foreground text-xl font-bold">
      dashboard
        </Link>
        <SignedOut>
        <Link href="/sign-up">
        <Button>Sign up</Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </div>
    </nav>
  )
}
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
      <div className="w-full bg-zinc-900 h-screen flex justify-center items-center">
        <SignIn />
      </div>
    );
}

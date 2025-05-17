import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="w-full bg-zinc-900 h-screen flex justify-center items-center">
      <SignUp />
    </div>
  );
}

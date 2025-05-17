import {
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
export default function Home() {
  return (
    <>
    <div className="w-screen h-auto flex justify-center items-center bg-zinc-900 text-white">
      <SignedOut>
        <p >SignUp to access content</p>
      </SignedOut>
      <SignedIn>
        <p >Here is your repos</p>
      </SignedIn>
    </div>
    </>
  );
}

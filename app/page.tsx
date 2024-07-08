import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

// Clerk also has clerk loading and clerk loaded components to show their loading states as well

export default function Home() {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen py-2">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        <UserButton />
      </SignedIn>
    </div>
  );
}

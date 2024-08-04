import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-agrandir pt-[130px] text-center mx-auto w-full">
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        Looks like you're not signed in! You'll be redirected to the login page.
      </SignedOut>
    </div>
  );
}

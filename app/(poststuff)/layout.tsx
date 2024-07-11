export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-agrandir pt-[120px] text-center mx-auto w-full">
      {children}
    </div>
  );
}

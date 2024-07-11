export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full items-center justify-center my-[150px] font-agrandir">
      {children}
    </div>
  );
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-white font-sans antialiased">
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}

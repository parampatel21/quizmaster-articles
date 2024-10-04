import "../styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="garden" lang="en">
      <body>{children}</body>
    </html>
  );
}

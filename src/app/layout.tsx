import '../styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="garden" lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Interactive MCQ Editor with TipTap" />
        <title>Interactive Article Editor</title>
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

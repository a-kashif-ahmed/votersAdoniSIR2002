// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
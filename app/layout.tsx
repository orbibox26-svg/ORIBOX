import "./globals.css";

export const metadata = {
  title: "Orbibox - Integrated system",
  description: "Orbibox integrated operational platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="!m-0 !p-0">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Orbibox - Integrated system</title>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="!m-0 !p-0 w-screen h-screen overflow-hidden">{children}</body>
    </html>
  );
}

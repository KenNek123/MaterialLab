import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vật liệu 3D | Phòng khám phá trực quan",
  description: "Công cụ giảng dạy trực quan giúp khám phá vật liệu từ vật thể, ô mạng đến cấp nguyên tử.",
  keywords: ["material science", "3D", "molecular", "crystal structure", "WebGL", "Three.js"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vật liệu 3D",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050510",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased selection:bg-blue-500/30 selection:text-blue-200">
      <body className="h-full w-full overflow-hidden select-none bg-[#050510]">
        {children}
      </body>
    </html>
  );
}


import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Materials Lab | GVHD: Nguyễn Văn Tài",
  description: "Phòng thí nghiệm vật liệu kỹ thuật số - Khám phá vật liệu từ vĩ mô đến cấp nguyên tử. GVHD: Nguyễn Văn Tài.",
  keywords: ["Digital Materials Lab", "material science", "3D", "molecular", "crystal structure", "WebGL", "Three.js"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Digital Materials Lab",
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


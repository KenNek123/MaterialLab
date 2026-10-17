import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Digital Matter Lab | Nguyễn Văn Tài",
  description: "Phòng thí nghiệm số trực quan hóa vật chất & cấu trúc nguyên tử 3D. Nguyễn Văn Tài.",
  keywords: ["Digital Matter Lab", "material science", "3D", "molecular", "crystal structure", "WebGL", "Three.js"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Digital Matter Lab",
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
    <html lang="vi" className={`h-full antialiased selection:bg-blue-500/30 selection:text-blue-200 ${montserrat.variable} ${montserrat.className}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function purgeNetlify() {
                  var selectors = [
                    '#nl-badge-frame',
                    '[id*="nl-badge"]',
                    '[class*="nl-badge"]',
                    'iframe[title*="Netlify" i]',
                    'iframe[title*="Powered by Netlify" i]',
                    'iframe[src*="netlify" i]',
                    'netlify-drawer',
                    '[data-netlify-drawer]'
                  ];
                  try {
                    selectors.forEach(function(sel) {
                      var els = document.querySelectorAll(sel);
                      for (var i = 0; i < els.length; i++) {
                        els[i].remove();
                      }
                    });
                  } catch (e) {}
                }
                purgeNetlify();
                if (typeof window !== 'undefined' && window.MutationObserver) {
                  var observer = new MutationObserver(function() {
                    purgeNetlify();
                  });
                  observer.observe(document.documentElement, { childList: true, subtree: true });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`h-full w-full overflow-hidden select-none bg-[#050510] ${montserrat.className}`}>
        {children}
      </body>
    </html>
  );
}


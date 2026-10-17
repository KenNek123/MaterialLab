import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Materials Lab | Nguyễn Văn Tài",
  description: "Phòng thí nghiệm vật liệu kỹ thuật số - Khám phá vật liệu từ vĩ mô đến cấp nguyên tử. Nguyễn Văn Tài.",
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
      <head>
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
      <body className="h-full w-full overflow-hidden select-none bg-[#050510]">
        {children}
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fuman-hiroba.tswcgwc69z.chatgpt.site"),
  title: { default: "愚痴・不満を匿名で投稿できる掲示板｜もやばら", template: "%s｜もやばら" },
  description: "愚痴や不満、ストレス、学校・仕事・家族・人間関係のモヤモヤを匿名で投稿できる無料掲示板。登録不要で、みんなの本音に『わかる』『私も』を届けられます。",
  keywords: ["愚痴","不満","匿名掲示板","ストレス","悩み","モヤモヤ","学校の愚痴","仕事の愚痴","人間関係の悩み","家族の悩み"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "もやばら｜その『なんか嫌だ』、あなただけじゃない",
    description: "言えなかったことを匿名で置いて、誰かの『わかる』と出会える場所。",
    images: [{ url: "/og.png", width: 1200, height: 675, alt: "もやばら" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "もやばら｜その『なんか嫌だ』、あなただけじゃない",
    description: "言えなかったことを匿名で置いて、誰かの『わかる』と出会える場所。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
        <aside className="topic-links" aria-label="愚痴・不満のカテゴリー">
          <h2>悩みや不満のカテゴリーから探す</h2>
          <div><Link href="/guchi/school">学校の愚痴</Link><Link href="/guchi/work">仕事の愚痴</Link><Link href="/guchi/relationships">人間関係の愚痴</Link><Link href="/guchi/family">家族への不満</Link><Link href="/guchi/society">社会への不満</Link><Link href="/guchi/daily">日常のモヤモヤ</Link></div>
        </aside>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"もやばら",alternateName:"不満の広場",url:"https://fuman-hiroba.tswcgwc69z.chatgpt.site/",description:"愚痴や不満を匿名で投稿し、共感し合える掲示板",inLanguage:"ja"})}} />
      </body>
    </html>
  );
}

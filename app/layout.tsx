import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fuman-hiroba.tswcgwc69z.chatgpt.site"),
  title: { default: "匿名で本音・告白・愚痴を投稿できる｜もやばら", template: "%s｜もやばら" },
  description: "人に言えなかった自分の話、誰も傷つけない失敗談、あの時の本音、感謝や勘違い、愚痴を匿名で投稿できる場所。第三者の秘密や個人情報は扱いません。",
  keywords: ["匿名投稿","本音","言えない話","告白","失敗談","愚痴","不満","匿名掲示板","モヤモヤ","学校の愚痴","仕事の愚痴","人間関係の悩み"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "もやばら｜愚痴だけじゃない、本音の置き場所",
    description: "自分の言えなかった話や本音を匿名で置いて、誰かの『わかる』と出会える場所。",
    images: [{ url: "/og.png", width: 1200, height: 675, alt: "もやばら" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "もやばら｜愚痴だけじゃない、本音の置き場所",
    description: "自分の言えなかった話や本音を匿名で置いて、誰かの『わかる』と出会える場所。",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"もやばら",alternateName:"本音の広場",url:"https://fuman-hiroba.tswcgwc69z.chatgpt.site/",description:"自分の本音や言えなかった話、愚痴を匿名で投稿し、共感し合える場所",inLanguage:"ja"})}} />
      </body>
    </html>
  );
}

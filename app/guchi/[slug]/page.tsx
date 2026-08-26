import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";

const topics={
 school:{label:"学校",title:"学校の愚痴・不満を匿名で話せる場所",description:"授業、校則、部活、クラス、先生など、学校生活で感じた愚痴や不満を匿名で投稿できます。",questions:["納得できない校則や決まり","授業や宿題へのモヤモヤ","クラスや部活で言えなかったこと"]},
 work:{label:"仕事",title:"仕事の愚痴・職場の不満を匿名で投稿",description:"職場、業務、会議、上司や同僚との関係など、仕事で感じたモヤモヤを匿名で共有できます。",questions:["非効率だと思う仕事の進め方","職場で言いづらかった本音","働き方や評価への疑問"]},
 relationships:{label:"人間関係",title:"人間関係の愚痴・言えない本音を匿名で",description:"友人や知人との距離感、コミュニケーションなど、人間関係の悩みや不満を匿名で話せます。",questions:["相手に言えずに残っていること","距離感が難しいと感じる場面","わかってもらえなかった気持ち"]},
 family:{label:"家族",title:"家族への不満・モヤモヤを匿名で共有",description:"家庭で感じる小さな不満や言いづらい気持ちを、個人が特定されない形で投稿できます。",questions:["家のルールへの疑問","言っても伝わらなかったこと","一人で抱えている小さな不満"]},
 society:{label:"社会",title:"社会への不満・変えてほしいことを投稿",description:"制度、マナー、サービス、世の中の仕組みへの疑問や不満を匿名で共有する掲示板です。",questions:["もっと使いやすくしてほしい制度","不公平だと感じた仕組み","社会に変わってほしいこと"]},
 daily:{label:"日常",title:"日常の小さな愚痴・モヤモヤを匿名で",description:"通勤通学、買い物、インターネットなど、毎日の小さなイライラやモヤモヤを気軽に投稿できます。",questions:["今日ちょっと困ったこと","なぜか気になってしまうマナー","もっと便利になってほしいこと"]}
} as const;
type Slug=keyof typeof topics;
export function generateStaticParams(){return Object.keys(topics).map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params,t=topics[slug as Slug];if(!t)return{};return{title:t.title,description:t.description,alternates:{canonical:`/guchi/${slug}`},openGraph:{title:t.title,description:t.description,url:`/guchi/${slug}`}}}
export default async function TopicPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params,t=topics[slug as Slug];if(!t)notFound();const schema={"@context":"https://schema.org","@type":"CollectionPage",name:t.title,description:t.description,url:`https://fuman-hiroba.tswcgwc69z.chatgpt.site/guchi/${slug}`,isPartOf:{"@type":"WebSite",name:"もやばら",url:"https://fuman-hiroba.tswcgwc69z.chatgpt.site/"}};return <main className="topic-page"><Link className="brand" href="/"><span>もや</span>ばら</Link><p className="eyebrow">{t.label}の声</p><h1>{t.title}</h1><p className="topic-lead">{t.description}否定や反論ではなく、「わかる」を届けるための場所です。</p><section><h2>こんなモヤモヤを話せます</h2><ul>{t.questions.map(q=><li key={q}>{q}</li>)}</ul></section><section className="topic-guide"><h2>安心して投稿するために</h2><p>実名、連絡先、具体的な学校名・会社名など、個人が特定できる情報は書かないでください。誰かへの攻撃ではなく、自分が感じたことを中心に書くと、共感が届きやすくなります。</p></section><Link className="primary topic-cta" href={`/?category=${encodeURIComponent(t.label)}#feed`}>{t.label}の声を見る・投稿する →</Link><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></main>}

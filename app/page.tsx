"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ThemeId = "guchi" | "confession" | "close_call" | "unsaid" | "gratitude" | "misunderstanding" | "tiny_secret";
type Post = { id: number; category: string; theme: ThemeId; body: string; empathy: number; same: number; createdAt: string };

const categories = ["すべて", "学校", "仕事", "家族", "人間関係", "社会", "日常", "その他"];
const themes: { id: ThemeId; icon: string; label: string; title: string; description: string; prompt: string }[] = [
  { id: "guchi", icon: "☁", label: "もやもや", title: "今日のもやもや", description: "言えなかった不満を、ここに置いていく。", prompt: "今日いちばん小さくイラッとしたことは？" },
  { id: "confession", icon: "✦", label: "告白", title: "人に言えなかった話", description: "自分についての、まだ誰にも話していないこと。", prompt: "誰にも言えなかった、自分の本音は？" },
  { id: "close_call", icon: "！", label: "ヒヤリ", title: "ギリギリ助かった話", description: "うっかりや勘違いで、冷や汗をかいた瞬間。", prompt: "あと少しで大変だった、誰も傷つけない失敗談は？" },
  { id: "unsaid", icon: "…", label: "本音", title: "あの時、本当はこう思った", description: "その場では飲み込んだ、自分の気持ち。", prompt: "あの時、口に出せなかった一言は？" },
  { id: "gratitude", icon: "＊", label: "感謝", title: "実は、ありがとうと思ってる", description: "本人にはまだ言っていない、小さな感謝。", prompt: "本人には言えていないけれど、感謝していることは？" },
  { id: "misunderstanding", icon: "？", label: "勘違い", title: "ずっと勘違いしていたこと", description: "あとから知って、少し恥ずかしくなった話。", prompt: "最近まで勘違いしていたことは？" },
  { id: "tiny_secret", icon: "◇", label: "ひみつ", title: "自分だけの小さなひみつ", description: "他人の秘密ではなく、自分だけの習慣やこだわり。", prompt: "誰にも迷惑をかけない、自分だけの小さなひみつは？" },
];
const samples: Post[] = [
  { id: -1, category: "学校", theme: "guchi", body: "『みんな同じペースでできるはず』という空気、ちょっと苦しい。得意なことも時間のかかることも、人それぞれなのに。", empathy: 128, same: 46, createdAt: "少し前" },
  { id: -2, category: "日常", theme: "misunderstanding", body: "ずっと別の読み方だと思っていた言葉を、最近になって初めて正しく知った。誰にも指摘されなくてよかった。", empathy: 74, same: 29, createdAt: "今日" },
  { id: -3, category: "人間関係", theme: "gratitude", body: "何も聞かずにいつも通り接してくれたこと、本当はすごく助かっていた。まだ直接は言えていない。", empathy: 93, same: 38, createdAt: "昨日" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(samples);
  const [category, setCategory] = useState("すべて");
  const [theme, setTheme] = useState<"all" | ThemeId>("all");
  const [sort, setSort] = useState<"new" | "popular" | "saved">("new");
  const [query, setQuery] = useState("");
  const [body, setBody] = useState("");
  const [postCategory, setPostCategory] = useState("日常");
  const [postTheme, setPostTheme] = useState<ThemeId>("guchi");
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [afterPost, setAfterPost] = useState(false);
  const [notice, setNotice] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [reacted, setReacted] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setSaved(JSON.parse(localStorage.getItem("moyabara-saved") || "[]"));
        setReacted(JSON.parse(localStorage.getItem("moyabara-reacted") || "[]"));
      } catch {}
      fetch("/api/posts").then(r => r.ok ? r.json() : Promise.reject()).then(d => {
        if (d.posts?.length) setPosts(d.posts);
      }).catch(() => {});
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedTheme = themes.find(item => item.id === postTheme)!;
  const shown = useMemo(() => posts
    .filter(post => category === "すべて" || post.category === category)
    .filter(post => theme === "all" || post.theme === theme)
    .filter(post => post.body.toLowerCase().includes(query.toLowerCase()))
    .filter(post => sort !== "saved" || saved.includes(post.id))
    .sort((a, b) => sort === "popular" ? (b.empathy + b.same) - (a.empathy + a.same) : b.id - a.id), [posts, category, theme, query, sort, saved]);
  const trends = useMemo(() => categories.slice(1).map(name => ({ name, count: posts.filter(post => post.category === name).length })).sort((a, b) => b.count - a.count).slice(0, 4), [posts]);
  const maxTrend = Math.max(...trends.map(item => item.count), 1);

  function toast(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 3200); }
  function chooseTheme(id: ThemeId, write = false) { setTheme(id); setPostTheme(id); if (write) setOpen(true); else location.hash = "feed"; }
  function writeFromPrompt() { setBody(`${selectedTheme.prompt}\n`); setOpen(true); }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const clean = body.trim();
    if (clean.length < 10) return toast("もう少しだけ詳しく書いてみてください（10文字以上）。");
    if (!privacyConfirmed) return toast("安全ルールを確認してください。");
    const response = await fetch("/api/posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body: clean, category: postCategory, theme: postTheme, privacyConfirmed }) });
    const data = await response.json();
    if (!response.ok) return toast(data.error || "投稿できませんでした。少し時間をおいて試してください。");
    setPosts(current => [data.post, ...current.filter(item => item.id > 0)]);
    setBody(""); setPrivacyConfirmed(false); setOpen(false); setAfterPost(true);
  }

  async function react(id: number, kind: "empathy" | "same") {
    const key = `${id}-${kind}`;
    if (reacted.includes(key)) return toast("その気持ちは、もう届けています。");
    const next = [...reacted, key]; setReacted(next); localStorage.setItem("moyabara-reacted", JSON.stringify(next));
    setPosts(current => current.map(post => post.id === id ? { ...post, [kind]: post[kind] + 1 } : post));
    if (id > 0) await fetch(`/api/posts/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: kind }) });
  }
  function save(id: number) { const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id]; setSaved(next); localStorage.setItem("moyabara-saved", JSON.stringify(next)); toast(saved.includes(id) ? "保存から外しました。" : "あとで見返せるよう保存しました。"); }
  async function report(id: number) { if (id > 0) await fetch(`/api/posts/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "report" }) }); toast("通報を受け付けました。内容を確認します。"); }

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span>もや</span>ばら</a><nav><a href="#themes">話すテーマ</a><a href="#feed">みんなの声</a><a href="#about">約束</a></nav><button className="primary small" onClick={() => setOpen(true)}>＋ 本音を置く</button></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">言えなかったことを、ここに置いていく。</p><h1>愚痴だけじゃない。<br/><em>あなたの本音の置き場所。</em></h1><p className="lead">もやもや、告白、ヒヤリとした話、言えなかった感謝。名前もアカウントもいらない、匿名の本音メディアです。</p><div className="hero-actions"><button className="primary" onClick={() => setOpen(true)}>本音を置いていく　→</button><a href="#themes">テーマを選ぶ</a></div><p className="safe-note">自分の話だけを。個人が特定できる情報や、他人の秘密は書かないでください。</p></div><div className="cloud-art" aria-hidden="true"><span className="cloud c1">言えなかった</span><span className="cloud c2">実はね…</span><span className="cloud c3">ふぅ。</span><div className="sun">ここなら。</div></div></section>
    <section className="theme-section" id="themes"><div className="theme-intro"><p className="eyebrow">CHOOSE A DOOR</p><h2>今日は、どの話を置いていく？</h2><p>気持ちに近い入口からどうぞ。読むだけでも大丈夫です。</p></div><div className="theme-grid">{themes.map(item => <article className={`theme-card theme-${item.id}`} key={item.id}><span className="theme-icon">{item.icon}</span><small>{item.label}</small><h3>{item.title}</h3><p>{item.description}</p><div><button onClick={() => chooseTheme(item.id)}>読む</button><button onClick={() => chooseTheme(item.id, true)}>書く →</button></div></article>)}</div></section>
    <section className="prompt-band"><div><span>{selectedTheme.label}の書き出し</span><p>{selectedTheme.prompt}</p></div><div><button className="shuffle" onClick={() => setPostTheme(themes[(themes.findIndex(item => item.id === postTheme) + 1) % themes.length].id)}>↻ 別のお題</button><button className="outline" onClick={writeFromPrompt}>このお題で書く →</button></div></section>
    <section className="feed" id="feed"><div className="section-head"><div><p className="eyebrow">VOICES</p><h2>いま、届いている本音</h2></div><div className="stats"><b>{posts.length + 1247}</b><span>件の声</span></div></div><div className="theme-tabs"><button className={theme === "all" ? "active" : ""} onClick={() => setTheme("all")}>すべて</button>{themes.map(item => <button key={item.id} className={theme === item.id ? "active" : ""} onClick={() => setTheme(item.id)}>{item.icon} {item.label}</button>)}</div><div className="toolbar"><div className="chips">{categories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="tools"><label className="search">⌕<input value={query} onChange={event => setQuery(event.target.value)} placeholder="声を検索"/></label><select value={sort} onChange={event => setSort(event.target.value as typeof sort)}><option value="new">新着順</option><option value="popular">共感順</option><option value="saved">保存した声</option></select></div></div>{notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}<div className="cards">{shown.map(post => { const lane = themes.find(item => item.id === post.theme) ?? themes[0]; return <article className="card" key={post.id}><div className="card-meta"><span className={`story-tag story-${lane.id}`}>{lane.icon} {lane.label}</span><span className={`tag tag-${post.category}`}>{post.category}</span><time>{post.createdAt}</time></div><p>{post.body}</p><div className="reactions"><button className={reacted.includes(`${post.id}-empathy`) ? "done" : ""} onClick={() => react(post.id, "empathy")}>☁ わかる <b>{post.empathy}</b></button><button className={reacted.includes(`${post.id}-same`) ? "done" : ""} onClick={() => react(post.id, "same")}>◌ 私も <b>{post.same}</b></button><button className={saved.includes(post.id) ? "save done" : "save"} onClick={() => save(post.id)} aria-label="保存">{saved.includes(post.id) ? "★" : "☆"}</button><button className="report" onClick={() => report(post.id)} aria-label="通報">…</button></div></article>})}{!shown.length && <div className="empty"><b>この入口には、まだ声がありません。</b><p>最初の声を置いてみませんか。</p></div>}</div></section>
    <section className="trend-section"><div className="trend-copy"><p className="eyebrow">TODAY&apos;S VOICES</p><h2>今日、みんなが<br/>話したかったこと。</h2><p>声を集計して、個人ではなく「みんなの本音」として眺めます。</p></div><div className="trend-panel">{trends.map((item, index) => <button key={item.name} onClick={() => { setCategory(item.name); location.hash = "feed"; }}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.name}</b><i><u style={{ width: `${Math.max(12, item.count / maxTrend * 100)}%` }}/></i><small>{item.count}件</small></button>)}</div></section>
    <section className="about" id="about"><p className="eyebrow">OUR PROMISE</p><h2>秘密を暴く場所ではなく、<br/>自分の本音を軽くする場所。</h2><div className="promises"><div><b>01</b><h3>自分の話だけ</h3><p>他人の秘密や、本人を特定できる情報は投稿しません。</p></div><div><b>02</b><h3>危険を隠さない</h3><p>危険・違法な行為を隠すための体験談は扱いません。</p></div><div><b>03</b><h3>攻撃しない</h3><p>誰かを傷つける表現は掲載せず、通報された内容を確認します。</p></div></div></section>
    <footer><div className="brand"><span>もや</span>ばら</div><p>本音に、置き場所を。</p><p className="copyright">© 2026 Moyabara</p></footer>
    {open && <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setOpen(false)}><section className="modal" role="dialog" aria-modal="true"><button className="close" onClick={() => setOpen(false)}>×</button><p className="eyebrow">LET IT OUT</p><h2>{selectedTheme.title}</h2><p>{selectedTheme.description} うまくまとめなくても大丈夫です。</p><form onSubmit={submit}><label>話の入口<select value={postTheme} onChange={event => setPostTheme(event.target.value as ThemeId)}>{themes.map(item => <option value={item.id} key={item.id}>{item.icon} {item.title}</option>)}</select></label><label>カテゴリー<select value={postCategory} onChange={event => setPostCategory(event.target.value)}>{categories.slice(1).map(item => <option key={item}>{item}</option>)}</select></label><label>あなたの話<textarea maxLength={300} value={body} onChange={event => setBody(event.target.value)} placeholder={selectedTheme.prompt} autoFocus/></label><div className="counter"><span className={body.length > 270 ? "warn" : ""}>{body.length} / 300</span></div><label className="safety-check"><input type="checkbox" checked={privacyConfirmed} onChange={event => setPrivacyConfirmed(event.target.checked)}/><span>他人の秘密・個人を特定できる情報・危険な行為を隠す内容を含めていません。</span></label><button className="primary" type="submit">匿名で投稿する →</button></form><p className="rules">投稿内容は安全のため自動確認されます。</p></section></div>}
    {afterPost && <div className="modal-backdrop"><section className="modal after"><div className="release-cloud">☁</div><p className="eyebrow">THANK YOU</p><h2>置いていって、だいじょうぶ。</h2><p>あなたの声は匿名で届きました。少し画面から離れて休んでも大丈夫です。</p><div className="after-actions"><button className="primary" onClick={() => { setAfterPost(false); location.hash = "feed"; }}>届いた声を見る</button><button className="outline" onClick={() => setAfterPost(false)}>このまま休む</button></div></section></div>}
  </main>;
}

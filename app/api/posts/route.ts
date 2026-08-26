import { supabaseRequest } from "../../../lib/supabase-rest";

const allowedCategories = new Set(["学校", "仕事", "家族", "人間関係", "社会", "日常", "その他"]);
const allowedThemes = new Set(["guchi", "confession", "close_call", "unsaid", "gratitude", "misunderstanding", "tiny_secret"]);

type Row = {
  id: number;
  category: string;
  theme: string;
  body: string;
  empathy: number;
  same: number;
  created_at: string;
};

function unsafe(body: string) {
  const contact = /\b(?:0\d{1,4}-?\d{1,4}-?\d{3,4}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|https?:\/\/\S+)\b/i;
  const identifying = /(本名|フルネーム|住所|電話番号|学校名|会社名|アカウント名|ユーザー名)\s*[:：は]/;
  const dangerousConcealment = /(万引き|盗難|違法行為|犯罪行為|未成年飲酒|未成年喫煙)/;
  const repeated = /(.)\1{14,}/;
  return contact.test(body) || identifying.test(body) || dangerousConcealment.test(body) || repeated.test(body);
}

function shape(row: Row) {
  return {
    id: row.id,
    category: row.category,
    theme: row.theme,
    body: row.body,
    empathy: row.empathy,
    same: row.same,
    createdAt: row.created_at,
  };
}

export async function GET() {
  try {
    const rows = await supabaseRequest<Row[]>(
      "posts?select=id,category,theme,body,empathy,same,created_at&status=eq.visible&reports=lt.3&order=created_at.desc,id.desc&limit=60",
      { cache: "no-store" },
    );
    return Response.json({ posts: rows.map(shape) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "声を読み込めませんでした。少し時間をおいて試してください。" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({})) as {
    body?: string;
    category?: string;
    theme?: string;
    privacyConfirmed?: boolean;
  };
  const body = payload.body?.trim() ?? "";
  const category = allowedCategories.has(payload.category ?? "") ? payload.category! : "その他";
  const theme = allowedThemes.has(payload.theme ?? "") ? payload.theme! : "guchi";

  if (!payload.privacyConfirmed) return Response.json({ error: "安全ルールを確認してください。" }, { status: 400 });
  if (body.length < 10 || body.length > 300) return Response.json({ error: "本文は10〜300文字で入力してください。" }, { status: 400 });
  if (unsafe(body)) return Response.json({ error: "個人を特定できる情報や、危険・違法な行為を隠す内容は投稿できません。" }, { status: 400 });

  try {
    const rows = await supabaseRequest<Row[]>("posts?select=id,category,theme,body,empathy,same,created_at", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ category, theme, body }),
    });
    return Response.json({ post: shape(rows[0]) }, { status: 201 });
  } catch {
    return Response.json({ error: "投稿できませんでした。少し時間をおいて試してください。" }, { status: 503 });
  }
}

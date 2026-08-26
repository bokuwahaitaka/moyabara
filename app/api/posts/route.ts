import { supabaseRequest } from "../../../lib/supabase-rest";

const allowed = new Set(["学校", "仕事", "家族", "人間関係", "社会", "日常", "その他"]);
type Row = { id: number; category: string; body: string; empathy: number; same: number; created_at: string };

function unsafe(body: string) {
  const contact = /\b(?:0\d{1,4}-?\d{1,4}-?\d{3,4}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|https?:\/\/\S+)\b/i;
  const repeated = /(.)\1{14,}/;
  return contact.test(body) || repeated.test(body);
}

function shape(row: Row) {
  return { id: row.id, category: row.category, body: row.body, empathy: row.empathy, same: row.same, createdAt: row.created_at };
}

export async function GET() {
  try {
    const rows = await supabaseRequest<Row[]>("posts?select=id,category,body,empathy,same,created_at&status=eq.visible&reports=lt.3&order=created_at.desc,id.desc&limit=60", { cache: "no-store" });
    return Response.json({ posts: rows.map(shape) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "声を読み込めませんでした。少し時間をおいて試してください。" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({})) as { body?: string; category?: string };
  const body = payload.body?.trim() ?? "";
  const category = allowed.has(payload.category ?? "") ? payload.category! : "その他";
  if (body.length < 10 || body.length > 300) return Response.json({ error: "本文は10〜300文字で入力してください。" }, { status: 400 });
  if (unsafe(body)) return Response.json({ error: "連絡先やURLなど、個人が特定される可能性のある内容を外してください。" }, { status: 400 });
  try {
    const rows = await supabaseRequest<Row[]>("posts?select=id,category,body,empathy,same,created_at", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ category, body }),
    });
    return Response.json({ post: shape(rows[0]) }, { status: 201 });
  } catch {
    return Response.json({ error: "投稿できませんでした。少し時間をおいて試してください。" }, { status: 503 });
  }
}

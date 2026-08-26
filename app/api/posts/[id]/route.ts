import { supabaseRequest } from "../../../../lib/supabase-rest";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => ({})) as { action?: string };
  if (!["empathy", "same", "report"].includes(payload.action ?? "") || !/^\d+$/.test(id)) {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }
  try {
    await supabaseRequest("rpc/increment_post_signal", {
      method: "POST",
      body: JSON.stringify({ p_post_id: Number(id), p_signal: payload.action }),
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "更新できませんでした。少し時間をおいて試してください。" }, { status: 503 });
  }
}

import assert from "node:assert/strict";
import test from "node:test";

test("renders public Moyabara metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>愚痴・不満を匿名で投稿できる掲示板｜もやばら<\/title>/);
  assert.match(html, /<meta property="og:title" content="もやばら｜その『なんか嫌だ』、あなただけじゃない"\/>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/fuman-hiroba\.tswcgwc69z\.chatgpt\.site\/"\/>/);
});

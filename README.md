# もやばら

匿名で愚痴や不満を投稿し、「わかる」「私も」を届けられる公開サイトです。

- 本番サイト: https://fuman-hiroba.tswcgwc69z.chatgpt.site
- データベース: Supabase Postgres（東京リージョン）
- フロントエンド: Next.js / React / Vinext / Cloudflare Workers

## ローカル開発

Node.js 22.13以上を使用します。

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.local` にSupabaseのProject URLとpublishable keyを設定してください。`service_role`やsecret keyはブラウザやGitHubへ置かないでください。

## 検証

```bash
npm run lint
npm test
```

Pull Requestと`main`へのpushではGitHub Actionsが同じ検証を実行します。

## データベース

Supabaseの変更履歴は `supabase/migrations/` に保存しています。公開テーブルではRLSを有効にし、匿名ユーザーには必要最小限の権限だけを付与しています。

## 運用上の注意

- 投稿本文に実名、連絡先、URLなどを含めないでください。
- 通報が3件に達した投稿は公開一覧から自動的に除外されます。
- Supabaseのpublishable keyは公開可能ですが、secret keyは絶対にコミットしないでください。

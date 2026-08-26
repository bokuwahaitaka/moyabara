# Community Sites Suite

ユーザー投稿によって成長する4サイトのMVP。

- `korekomatta/` — 困りごと・解決体験DB
- `taikyo/` — 賃貸退去費用の実例DB
- `gyosei/` — 行政手続き体験Wiki
- `schoolwiki/` — 学校のリアル情報Wiki

## Backend

Supabase の `public.community_posts` を4サイトで共用し、`site` カラムで分離しています。

- 公開投稿の読み取り
- 匿名投稿
- 「役に立った」カウント
- 通報
- 5件の通報で自動非表示

フロントエンドには公開用の Supabase publishable key のみを使用しています。service role key は含まれていません。

## Run locally

静的ファイルなので `community-sites` ディレクトリを任意のHTTPサーバーで配信してください。各サイトは単独でも動作します。

## Next production steps

1. 各サイトを独立リポジトリ・独自ドメインへ分離
2. CAPTCHA / rate limit / moderation dashboard
3. SEO向け詳細ページ・構造化データ・sitemap
4. 認証と投稿履歴
5. 集計ページ（地域別・カテゴリ別・年度別）

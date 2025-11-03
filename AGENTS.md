# リポジトリガイドライン（Repository Guidelines）

## プロジェクト構成とモジュール配置
- Next.js の App Router 本体は `src/app` にあり、レイアウト、ルート、`sitemap.ts` などのメタデータを管理します。
- 再利用可能な UI は `src/components`、型付きデータソースは `src/data`、タイムゾーン処理などの補助関数は `src/lib` に配置します。
- `public` には `public/sitemap.xml` を含む公開アセットとリダイレクト関連ファイルを置き、企画メモや要件は `docs/` に整理します。

## ビルド・テスト・開発コマンド
- `npm run dev`：ホットリロード付きのローカルサーバーを `http://localhost:3000` で起動します。
- `npm run lint`：Next.js 設定の ESLint を実行するため、レビュー前に警告をすべて解消します。
- `npm run build`：本番ビルドを生成し、TypeScript の整合性も同時に検証します。
- `npm run start`：ビルド済み成果物を起動し、リダイレクト挙動や API 出力をスモークテストします。

## コーディングスタイルと命名規則
- TypeScript の strict オプションを前提とし、可能な範囲で純粋関数と React Server Components を採用します。
- コンポーネントおよびファイル名はパスカルケース（例：`WeatherPanel.tsx`）、フックはキャメルケース（例：`useForecast.ts`）、定数はスネーク大文字（例：`DEFAULT_OFFSET_MINUTES`）を用います。
- Tailwind CSS のユーティリティを組み合わせる際は、レイアウト、余白、配色の順でグループ化して読みやすさを確保します。
- 共有モジュールは相対パスではなく `@/...` エイリアス経由でインポートします。
- 例外ケースのドキュメントは、意図と制約を説明する完結した文章で記述します。

## テスト指針
- まだ自動テスト基盤がないため、各 Pull Request で `npm run lint` と `npm run build` の結果を共有し、ランディングページと関連ルートを手動確認します。
- 複雑なロジックを追加する際は `src/__tests__` にユニットテストを配置し、使用したテストランナー（Vitest か Jest）を Pull Request に明記します。
- データ更新時は Formula 1 天気データの実際の情報と照合し、確認手順を Pull Request の説明に記録します。

## コミットおよび Pull Request ガイドライン
- 作業開始時は `git checkout -b feature/<short-description>` でトピックブランチを作成し、`git push origin <branch-name>` でリモートへ共有します。
- コミットメッセージは既存の日本語命令形スタイル（例：`サーキット一覧の並びを更新`）を踏襲し、変更点を端的にまとめます。
- Pull Request では関連する `docs/` 内の要件ファイルを参照し、ユーザーへの影響、実行コマンド、レイアウト変更がある場合の UI キャプチャを記載します。

## エージェント作業メモ
- プロセスやアーキテクチャ判断が更新された際は `AGENTS.md` を即座に改訂し、UTF-8 かつ UNIX 改行を維持します。
- サイト移行タスクは `docs/02-requirements-addv1.md` と連携し、`https://f1weathers.com` 用のサイトマップ再生成を含めます。
- リリース前のスモークテストでは `https://f1-weather-two.vercel.app` からの 308 リダイレクトが新ドメインに到達することを必ず確認します。
- SEO の優先課題は `docs/requirements-addv2.md` に集約しており、OG/Twitterメタタグ整備や構造化データ拡張、サイトマップ動的生成が P0〜P1 として定義されている。着手時は同ドキュメントの更新履歴を必ず確認する。

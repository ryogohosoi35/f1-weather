# F1天気予報サイト 開発TODO

## 直近優先タスク
- [ ] GP検索モーダルとフィルターUIを実装する。`searchGrandPrixWeather` サーバーアクションを接続し、過去GPと全GPを切り替えられる導線をメインページ上部に追加する。
- [ ] 構造化データとメタ情報を新ドメイン `https://f1weathers.com` に統一する。`src/app/layout.tsx` の JSON-LD と外部リンク、OG 画像の参照先を洗い出し、リリース前に再確認する。
- [ ] レース週末の気象更新頻度を文書化し、運用フロー（手動再検証、キャッシュ再生成）を `docs/` 配下に追記する。公開後の再検証時間を決め、GSC との連携タイミングを明確にする。

## 中期改善タスク
- [ ] ISR もしくは `revalidateTag` を活用し、Open-Meteo API 呼び出しのキャッシュポリシーを最適化する。外部 API 失敗時のフォールバックメッセージも合わせて実装する。
- [ ] `src/data/grandprix-2025.ts` のスケジュールを FIA 公開資料と突き合わせ、延期や時間変更が発生した場合の更新手順を決める。
- [ ] Tailwind のユーティリティ構成を整理し、共通スタイルを `src/components/ui` に集約する。暗色モードでのコントラストチェック結果を `docs/` に残す。

## 品質・運用タスク
- [ ] Vitest もしくは Jest を導入し、`src/lib/utils` と `src/lib/actions` の単体テストを作成する。API 呼び出し部はモックを用意し、最低限の回帰テストを整備する。
- [ ] Lighthouse モバイル向けのスコア計測を行い、レポートと改善案を `docs/performance.md`（新規）にまとめる。特に CLS と TBT のボトルネックを可視化する。
- [ ] GSC のカバレッジレポート確認と 308 リダイレクト監視をリリースチェックリストに追加する。`docs/requirements-addv1.md` と同期する。
- [ ] テスト駆動開発を実施する際の手順書を整備し、最初のターゲットとして `src/lib/utils` にテスト雛形を追加する計画を作成する。探索・計画・実装の記録は毎回 `docs/` に追記する。

## 完了済みハイライト
- [x] Next.js 14（App Router）による基盤構築と Shadcn UI の導入が完了した。
- [x] Open-Meteo API を用いた天気予報・過去天候の取得と、`GPWeatherCard` によるセッション別表示が正常に動作している。
- [x] `src/app/sitemap.ts` と `public/robots.txt` を新ドメイン向けに整備し、サイトマップ提供の初期セットアップを完了した。

## 参考メモ
- Open-Meteo API: https://open-meteo.com/
- Shadcn/ui を中心とした UI コンポーネント構成で運用する。
- Server Components を主体としつつ、インタラクティブな部分のみ Client Components として分離する。

## ドキュメント運用メモ
- すべての主要な開発作業では Explore-Plan-Code の順序で記録を残し、要点を `AGENTS.md` と該当ドキュメントに反映する。
- ドメイン移行や SEO 関連の更新を行った際は、`docs/requirements-addv1.md` と `docs/requirements-addv2.md` の差分を確認し、整合性を保つメモを追記する。

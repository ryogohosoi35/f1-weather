# 追加要件 v3: Google Search Console 改善計画

## 背景と目的
最新の Google Search Console（以下 GSC）で、構造化データに関する以下のエラーが 2025 年 11 月時点で報告された。

- `offers` 欠落（24 件）
- `image` 欠落（24 件）
- `performer` 欠落（24 件）
- `endDate` 欠落（20 件）
- `eventStatus` 欠落（20 件）
- `description` 欠落（20 件）
- `organizer` 欠落（20 件）
- `location` 欠落（20 件）

これらは `SportsEvent` スキーマの不足が主因であり、リッチリザルト生成が阻害されている。v3 では構造化データの再設計と運用フローを明確化し、GSC の検出精度向上と警告ゼロを目指す。

## 対象範囲
1. `SportsEvent`・`EventSeries` 構造化データの必須項目整備と値の整合性保証
2. 構造化データに依存する内部リンク（`offers.url` など）のアクセス性担保
3. GSC での検証から改善完了報告までの運用フロー定義
4. テスト自動化（型検査および簡易ユニットテスト）を利用した回 regressions 防止

## 実装マイルストーン

### マイルストーン1: スキーマ定義の拡張と型安全化
- `src/lib/utils/schema.ts` における `SportsEvent` 生成ロジックへ以下の属性を追加する。
  - `image`：`/og-default.jpg` を既定値として採用し、サーキット固有画像が用意できた場合は差し替え可能な設計にする。
  - `offers`：価格は 0 円で公開情報を提供する扱いとし、`?race=<grandPrix.id>` のクエリを持つ情報ハブ URL を生成する。`availability` は `InStock` を設定し、`validFrom` を各セッションの開始日時に合わせる。
  - `performer`：`SportsOrganization` として「Formula 1 Teams」を明示し、観戦者向けに参加主体を説明する。
  - `eventAttendanceMode`：オフライン開催であることを `OfflineEventAttendanceMode` によって示す。
- サブイベント（練習走行・予選・決勝など）についても上記属性を継承し、`calculateEndDate` によって推定終了時刻を付加する。
- セッションメタデータ（日本語説明、所要時間）を `SESSION_METADATA` として定義し、構造化データに自然文の説明を含める。
- TypeScript の補助インターフェース（`SportsEventOffer`、`SportsEventPerformer`）を導入して型安全に実装する。

### マイルストーン2: テストおよび自動検証基盤の整備
- `tests/createSportsEventSchema.test.ts` を新設し、`createSportsEventSchema` の出力が上記必須フィールドを満たすか静的型検査と実行時アサーションで担保する。
- `tsconfig.schema-test.json` を用意し、`npx tsc -p tsconfig.schema-test.json` による部分ビルドで Next.js 固有の型エラーを回避しながら検証できるようにする。
- テスト実行手順を CI もしくは手動フローに組み込み、`node tmp-tests/tests/createSportsEventSchema.test.js` でレグレッション検知を実施する。
- 生成された URL（特に `offers.url`）が 200 を返すかを `curl` 等で検証し、CI の追加を検討する。

### マイルストーン3: GSC での検証とフィードバックループ構築
- デプロイ後 24 時間以内に GSC の「拡張」>「イベント」レポートで状態を確認し、エラーが解消しているかを記録する。
- エラー解消が確認できない場合は、対象ページを URL 検査ツールで再クロールリクエストし、結果を `docs/` 内に追記する。
- リッチリザルトテスト（https://search.google.com/test/rich-results）を用いて、サンプル URL（トップページおよび次戦・今後のレースセクション）で構造化データの妥当性を二重確認する。
- GSC にて「検証を開始」機能を利用し、完了通知が届いたら結果と日時を `AGENTS.md` および本ドキュメントに追記する。

### マイルストーン4: 運用と継続改善
- 新しいレースデータ（`src/data/grandprix-20xx.ts`）を追加する際は、練習・予選・決勝の日時が ISO 8601 形式で格納されているかをレビュー checklist に追加する。
- サーキットごとの固有画像が用意できた場合は、`DEFAULT_EVENT_IMAGE_PATH` を差し替え可能な構造（例：`grandPrix.imageUrl`）に拡張する改善案を backlog に追加する。
- 季節や開催地の変更で `durationMinutes` が大幅に変わる場合は、`SESSION_METADATA` の定数を更新し、テストを再実行して整合性を確保する。
- 季節前後で `startDate` / `endDate` にズレが生じた場合、GSC の「カバレッジ」レポートに新規エラーが出ていないかを月次で確認し、異常があれば `docs/requirements-addv3.md` を更新する。

## 検証シナリオ
- **構造化データ単体検証**：ローカル環境で `createSportsEventSchema` の JSON を出力し、`jq` などで `offers`, `performer`, `image`, `endDate` が存在するか確認する。
- **公開環境検証**：`curl https://f1weathers.com` で埋め込みスクリプトを取得し、`grep -q "\"SportsEvent\""` で含有を確認。エラーがあればログを保存する。
- **GSC 検証**：`イベント` レポートのステータス遷移（エラー → 検証中 → 合格）をスクリーンショットで保存し、リリースノートに添付する。
- **リンク検証**：`offers.url` で生成されるクエリ付き URL を `curl -I` し、`HTTP/2 200` が返ることを SNSO チェックリストへ組み込む。

## 関連ドキュメントと更新手順
- `AGENTS.md`：方針・検証手順を時系列で追記する（2025-11-04 更新済み）。
- `docs/requirements-addv1.md`・`docs/requirements-addv2.md`：サイトマップやメタデータ整備の状況を参照し、重複タスクがないか確認する。
- Pull Request 作成時は、上記ドキュメント変更と `npm run lint` / `npx tsc -p tsconfig.schema-test.json` / `node tmp-tests/tests/createSportsEventSchema.test.js` の実行結果を含める。

## リスクと緩和策
- **リスク**：サブイベントに必要な時間情報が欠落している場合、`endDate` が `startDate` と同一になり GSC が警告を出す可能性がある。
  - **緩和策**：日付が無効だったケースはログに記録し、`SESSION_METADATA` の `durationMinutes` を見直す。
- **リスク**：`offers.url` に紐づくページが公開前に 404 となり、リンク切れ警告が発生する。
  - **緩和策**：ビルド時に `/` でクエリなしアクセスでも情報が取得できるようにし、`?race=<id>` をクライアントレンダリングでハンドルする。
- **リスク**：GSC の検証完了までにタイムラグが生じ、改善状況が把握しづらくなる。
  - **緩和策**：改善作業から 48 時間後にフォローアップを行い、未完了の場合はメモを `docs/` に追記して引き継ぐ。

## 今後の展望
- レース詳細ページを個別 URL として展開する際は、同じ `SportsEvent` をページごとに埋め込み、`offers` 先を該当ページへ更新する拡張計画を立てる。
- 公式チケット API など外部データソースの活用を検討し、`price` を実額に置き換えることでリッチリザルトの価値を高める。
- Search Console の API 連携を行い、改善ステータスをダッシュボード化することで確認コストを下げる。

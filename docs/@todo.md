# F1天気予報サイト開発 TODO

## 🔴 Phase 1: プロジェクト基盤構築

### 環境セットアップ
- [ ] Next.js 14プロジェクト初期化
  - TypeScript設定
  - ESLint設定
  - Tailwind CSS設定
- [ ] 必要ライブラリのインストール
  - Shadcn/ui
  - Lucide React (アイコン)
  - date-fns (日付処理)
  - Zod (バリデーション)
- [ ] ディレクトリ構造の作成
  - components/features/weather
  - components/common
  - lib/types
  - lib/utils
  - app/api

### データ構造設計
- [ ] F1 GPスケジュールの型定義
  - GP名、サーキット名、日程、緯度経度
- [ ] 天気データの型定義
  - Open-Meteo APIレスポンス対応
- [ ] GPデータのJSONファイル作成
  - 2024年スケジュール
  - 過去GPデータ

## 🟡 Phase 2: コア機能実装

### API統合
- [ ] Open-Meteo API統合
  - 天気予報データ取得
  - 過去天気データ取得
  - エラーハンドリング
- [ ] Server Actions実装
  - 天気データ取得用
  - GP検索用

### UI コンポーネント実装
- [ ] GPWeatherCard コンポーネント
  - GP情報表示
  - 天気アイコン・絵文字
  - 気温・降水確率表示
- [ ] WeatherIcon コンポーネント
  - 天気状況に応じたビジュアル
- [ ] GPSearchModal コンポーネント
  - 過去GP検索
  - 全GP検索
  - 検索フィルタリング

## 🟢 Phase 3: メイン画面実装

### レイアウト構築
- [ ] Header コンポーネント
  - サイトタイトル
  - モバイル最適化
- [ ] Footer コンポーネント
  - 著作権情報
  - APIクレジット
- [ ] メインページレイアウト
  - 次回GP大表示
  - 後続GP一覧
  - 検索ボタン配置

### レスポンシブデザイン
- [ ] モバイルファーストUI
  - タッチフレンドリーな操作
  - 適切なフォントサイズ
- [ ] タブレット・デスクトップ対応
  - グリッドレイアウト調整

## 🟢 Phase 4: レースウィークエンド対応

- [ ] GPスケジュールデータ更新
  - 全GPのレースウィークエンド（金〜日）の日付を反映
- [ ] JSTでの現在時刻取得ロジック修正
  - Rulesに基づき、`new Date()`をJST基準に更新
- [ ] 天気取得ロジック修正
  - レースウィークエンドの3日間の天気データを取得するように変更
- [ ] GPWeatherCardコンポーネント改修
  - 金・土・日の天気を個別表示
- [ ] 検索機能実装
  - 過去GP検索
  - 全GP検索

## 🟢 Phase 5: パフォーマンス最適化・品質向上

### パフォーマンス
- [ ] ISR設定
  - 天気データの適切なキャッシュ
- [ ] 画像最適化
  - next/image活用
- [ ] メタデータ設定
  - SEO対応

### 品質保証
- [ ] TypeScript厳格設定
- [ ] アクセシビリティ対応
- [ ] モバイルパフォーマンステスト

## 🔴 Phase 6: デプロイメント準備

### 本番環境対応
- [ ] 環境変数設定
- [ ] Vercel設定
- [ ] ドメイン設定（必要に応じて）

## 完了済み
- [x] 要件定義書確認
- [x] TODO作成
- [x] ビルドエラー修正

### Phase 1: プロジェクト基盤構築 ✅
- [x] Next.js 14プロジェクト初期化
  - TypeScript設定
  - ESLint設定
  - Tailwind CSS設定
- [x] 必要ライブラリのインストール
  - Shadcn/ui
  - Lucide React (アイコン)
  - date-fns (日付処理)
  - Zod (バリデーション)
- [x] ディレクトリ構造の作成
  - components/features/weather
  - components/common
  - lib/types
  - lib/utils
  - app/api

### データ構造設計 ✅
- [x] F1 GPスケジュールの型定義
  - GP名、サーキット名、日程、緯度経度
- [x] 天気データの型定義
  - Open-Meteo APIレスポンス対応
- [x] GPデータのJSONファイル作成
  - 2024年スケジュール

### Phase 2: コア機能実装 ✅
- [x] Open-Meteo API統合
  - 天気予報データ取得
  - 過去天気データ取得
  - エラーハンドリング
- [x] Server Actions実装
  - 天気データ取得用
  - GP検索用

### UI コンポーネント実装 ✅
- [x] GPWeatherCard コンポーネント
  - GP情報表示
  - 天気アイコン・絵文字
  - 気温・降水確率表示
- [x] WeatherIcon コンポーネント
  - 天気状況に応じたビジュアル
- [x] Header コンポーネント
  - サイトタイトル
  - モバイル最適化
- [x] Footer コンポーネント
  - 著作権情報
  - APIクレジット

### Phase 3: メイン画面実装 ✅
- [x] メインページレイアウト
  - 次回GP大表示
  - 後続GP一覧
  - 基本的な検索ボタン配置

## メモ
- Open-Meteo API: https://open-meteo.com/
- Shadcn/ui重点使用
- Server Components主体
- モバイルファースト必須 
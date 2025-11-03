import { MetadataRoute } from 'next';

/**
 * Next.js App Routerのサイトマップ生成機能
 *
 * このファイルにより、https://f1weathers.com/sitemap.xml が自動的に生成されます。
 * 検索エンジンのクローラーに対して、サイト内の全ページとその最終更新日を提供します。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // サイトのベースURL（新ドメイン）
  const baseUrl = 'https://f1weathers.com';

  // 現在の日時を取得（最終更新日として使用）
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}

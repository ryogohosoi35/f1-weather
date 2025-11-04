// offers.urlの生成結果を確認するテストスクリプト
const { createSportsEventSchema } = require('../tmp-tests/src/lib/utils/schema.js');

const sampleGrandPrix = {
  id: 'test-gp',
  name: 'テストGP',
  circuitName: 'テスト・サーキット',
  location: {
    country: 'テスト国',
    city: 'テスト市',
    latitude: 10.0,
    longitude: 20.0
  },
  dateStart: '2025-06-01',
  dateEnd: '2025-06-03',
  round: 1,
  season: 2025,
  sessions: {
    race: '2025-06-03T11:00:00Z'
  }
};

// デフォルトサイトURL（本番環境）でテスト
const schemaDefault = createSportsEventSchema(sampleGrandPrix);
console.log('Default site URL:', process.env.NEXT_PUBLIC_SITE_URL || 'https://f1weathers.com');
console.log('offers.url:', schemaDefault.offers.url);
console.log('image:', schemaDefault.image);

// カスタムURLでテスト
const schemaCustom = createSportsEventSchema(sampleGrandPrix, undefined, 'https://example.com');
console.log('\nCustom site URL: https://example.com');
console.log('offers.url:', schemaCustom.offers.url);
console.log('image:', schemaCustom.image);

// 各セッションのoffers.urlも確認
if (schemaDefault.subEvent && schemaDefault.subEvent.length > 0) {
  console.log('\nSubEvent offers.url:', schemaDefault.subEvent[0].offers.url);
}

console.log('\nURL生成の検証完了');
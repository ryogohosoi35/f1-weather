// URL形式の一貫性を確認するテストスクリプト
const { createSportsEventSchema, createEventSeriesSchema } = require('../tmp-tests/src/lib/utils/schema.js');

const sampleGrandPrix = {
  id: 'monaco-gp',
  name: 'モナコGP',
  circuitName: 'モンテカルロ市街地',
  location: {
    country: 'モナコ',
    city: 'モナコ',
    latitude: 43.7347,
    longitude: 7.4206
  },
  dateStart: '2025-05-23',
  dateEnd: '2025-05-25',
  round: 8,
  season: 2025,
  sessions: {
    fp1: '2025-05-23T10:30:00Z',
    qualifying: '2025-05-24T14:00:00Z',
    race: '2025-05-25T13:00:00Z'
  }
};

// URLに末尾スラッシュがないケース
console.log('=== URL without trailing slash: https://f1weathers.com ===');
const schemaNoSlash = createSportsEventSchema(sampleGrandPrix, undefined, 'https://f1weathers.com');
console.log('Main Event @id:', schemaNoSlash['@id']);
if (schemaNoSlash.subEvent && schemaNoSlash.subEvent.length > 0) {
  console.log('SubEvent @id:', schemaNoSlash.subEvent[0]['@id']);
}

// URLに末尾スラッシュがあるケース
console.log('\n=== URL with trailing slash: https://f1weathers.com/ ===');
const schemaWithSlash = createSportsEventSchema(sampleGrandPrix, undefined, 'https://f1weathers.com/');
console.log('Main Event @id:', schemaWithSlash['@id']);
if (schemaWithSlash.subEvent && schemaWithSlash.subEvent.length > 0) {
  console.log('SubEvent @id:', schemaWithSlash.subEvent[0]['@id']);
}

// EventSeriesのケース
console.log('\n=== EventSeries ===');
const eventSeries = createEventSeriesSchema([sampleGrandPrix], 'https://f1weathers.com');
console.log('EventSeries @id:', eventSeries['@id']);

// 一貫性チェック
console.log('\n=== Consistency Check ===');
const mainId = schemaNoSlash['@id'];
const subId = schemaNoSlash.subEvent[0]['@id'];

// メインとサブイベントのURLフォーマットが一致しているか確認
const mainBase = mainId.split('#')[0];
const subBase = subId.split('#')[0];

if (mainBase === subBase) {
  console.log('✅ URL形式が一貫しています');
  console.log(`   Base URL: ${mainBase}/`);
} else {
  console.log('❌ URL形式に不一致があります');
  console.log(`   Main Event base: ${mainBase}`);
  console.log(`   SubEvent base: ${subBase}`);
}
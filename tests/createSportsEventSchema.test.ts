import { strict as assert } from 'node:assert';
import { createSportsEventSchema } from '../src/lib/utils/schema';
import { GrandPrix } from '../src/lib/types';

const baseUrl = 'https://example.com/';

const sampleGrandPrix: GrandPrix = {
  id: 'sample-gp',
  name: 'サンプルGP',
  circuitName: 'サンプル・サーキット',
  location: {
    country: 'サンプル国',
    city: 'サンプル市',
    latitude: 10.1234,
    longitude: 20.5678
  },
  dateStart: '2025-06-01',
  dateEnd: '2025-06-03',
  round: 9,
  season: 2025,
  sessions: {
    fp1: '2025-06-01T09:00:00Z',
    qualifying: '2025-06-02T10:00:00Z',
    race: '2025-06-03T11:00:00Z'
  }
};

const schema = createSportsEventSchema(sampleGrandPrix, undefined, baseUrl);

assert.equal(schema.image, `${baseUrl}og-default.jpg`, 'image プロパティは既定のOG画像を指す必要があります');

assert(schema.performer, 'performer プロパティが存在する必要があります');
const performer = Array.isArray(schema.performer) ? schema.performer[0] : schema.performer;
assert(performer, 'performer 情報が適切に解決される必要があります');
assert.equal(performer["@type"], 'SportsOrganization', 'performer は SportsOrganization 型である必要があります');

assert(schema.offers, 'offers プロパティが存在する必要があります');
const offers = Array.isArray(schema.offers) ? schema.offers[0] : schema.offers;
assert(offers, 'offers 情報が適切に解決される必要があります');
assert.equal(offers["@type"], 'Offer', 'offers は Offer 型である必要があります');
assert(offers.url.startsWith(baseUrl), 'offers.url は基底URL配下の情報ページを指す必要があります');

assert(schema.subEvent && schema.subEvent.length > 0, 'subEvent がセッション情報を含む必要があります');

const raceSubEvent = schema.subEvent?.find(event => event.name.includes('決勝'));
assert(raceSubEvent, '決勝セッションの subEvent が存在する必要があります');
assert(raceSubEvent?.endDate, 'subEvent に endDate が必要です');
assert(raceSubEvent?.location, 'subEvent に location が必要です');
assert(raceSubEvent?.eventStatus, 'subEvent に eventStatus が必要です');
assert(raceSubEvent?.organizer, 'subEvent に organizer が必要です');
assert(raceSubEvent?.description, 'subEvent に description が必要です');
const raceOffer = Array.isArray(raceSubEvent.offers) ? raceSubEvent.offers[0] : raceSubEvent.offers;
assert(raceOffer, 'subEvent の offers 情報が適切に解決される必要があります');
const racePerformer = Array.isArray(raceSubEvent.performer) ? raceSubEvent.performer[0] : raceSubEvent.performer;
assert(racePerformer, 'subEvent の performer 情報が適切に解決される必要があります');

assert(raceSubEvent?.image, 'subEvent に image が必要です');
assert(raceOffer.url.startsWith(baseUrl), 'subEvent の offers.url は基底URL配下の情報ページを指す必要があります');
assert.equal(racePerformer["@type"], 'SportsOrganization', 'subEvent の performer は SportsOrganization 型である必要があります');

console.log('createSportsEventSchema schema validation passed');

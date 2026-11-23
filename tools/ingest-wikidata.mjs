#!/usr/bin/env node
/**
 * Build the local Chrononaut answer knowledge base from Wikidata Query Service.
 * Usage: WIKIDATA_CONTACT='you@example.com' node tools/ingest-wikidata.mjs --max-per-category=1000
 *
 * This is an offline build/import task, never a request made during gameplay.
 * The default is deliberately conservative; increase the cap in controlled batches.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = path.join(ROOT, 'data.js');
const OUTPUT_FILE = path.join(ROOT, 'answer-knowledge-base.json');
const ENDPOINT = 'https://query.wikidata.org/sparql';
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  return [key, value ?? 'true'];
}));
const MAX_PER_CATEGORY = Math.max(100, Math.min(20000, Number(args['max-per-category']) || 1000));
const PAGE_SIZE = Math.max(100, Math.min(500, Number(args['page-size']) || 250));
const LANGUAGES = (args.languages || 'en,it').split(',').map(v => v.trim()).filter(Boolean);
const CONTACT = process.env.WIKIDATA_CONTACT || 'contact-not-provided';
if (CONTACT === 'contact-not-provided') console.warn('Tip: set WIKIDATA_CONTACT to an email or project contact in the User-Agent.');
const DELAY_MS = Math.max(1000, Number(args.delay) || 1200);

const sandbox = { window: {} };
vm.runInNewContext(await fs.readFile(DATA_FILE, 'utf8'), sandbox, { timeout: 10000 });
const pools = sandbox.window.ChrononautContent.seeds.flatMap(group => group.rounds);
const queryJobs = [];
for (const pool of pools) {
  const criteria = pool.answerCriteria;
  if (!criteria) continue;
  for (const classId of criteria.classesAny || []) {
    const dateProperties = criteria.dateProperties || (criteria.dateProperty ? [criteria.dateProperty] : []);
    queryJobs.push({
      key: `${classId}|${(criteria.directorIds || []).join(',')}`,
      classId,
      dateProperties,
      directorIds: criteria.directorIds || [],
      poolIds: [pool.id]
    });
  }
}
const jobsByKey = new Map();
for (const job of queryJobs) {
  if (!jobsByKey.has(job.key)) jobsByKey.set(job.key, job);
  else jobsByKey.get(job.key).poolIds.push(...job.poolIds);
}

if (args['dry-run'] === 'true') {
  console.log(`Dry run: ${jobsByKey.size} Wikidata class/filter jobs from ${pools.filter(pool => pool.answerCriteria).length} eligible question pools.`);
  for (const job of jobsByKey.values()) console.log(`- ${job.classId}; dates=${job.dateProperties.join(',') || 'none'}; directors=${job.directorIds.join(',') || 'any'}`);
  process.exit(0);
}

function propertyVariable(propertyId) { return `?v_${propertyId.toLowerCase()}`; }
function makeQuery(job, limit, offset) {
  const dateVars = job.dateProperties.map(propertyVariable);
  const optionals = job.dateProperties.map(id => `OPTIONAL { ?item wdt:${id} ${propertyVariable(id)} . }`).join('\n');
  const directorOptional = job.directorIds.length ? 'OPTIONAL { ?item wdt:P57 ?director . }' : '';
  const directorFilter = job.directorIds.length
    ? `FILTER(?director IN (${job.directorIds.map(id => `wd:${id}`).join(', ')}))` : '';
  const grouped = ['?item', '?itemLabel', '?sitelinks', ...dateVars, '?director', '?directorLabel',
    '?originCountry', '?originCountryLabel', '?birthCountry', '?birthCountryLabel', '?publisher', '?publisherLabel'];
  return `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>
SELECT ${grouped.join(' ')} (GROUP_CONCAT(DISTINCT STR(?alias); separator="|") AS ?aliases) WHERE {
  ?item wdt:P31/wdt:P279* wd:${job.classId} .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "${LANGUAGES.join(',')}". }
  OPTIONAL { ?item skos:altLabel ?alias . FILTER(LANG(?alias) IN (${LANGUAGES.map(x => `"${x}"`).join(',')})) }
  OPTIONAL { ?item wikibase:sitelinks ?sitelinks . }
  ${optionals}
  ${directorOptional}
  OPTIONAL { ?item wdt:P495 ?originCountry . }
  OPTIONAL { ?item wdt:P19/wdt:P17 ?birthCountry . }
  OPTIONAL { ?item wdt:P123 ?publisher . }
  ${directorFilter}
  FILTER(BOUND(?itemLabel))
}
GROUP BY ${grouped.join(' ')}
ORDER BY DESC(?sitelinks) STR(?item)
LIMIT ${limit} OFFSET ${offset}`;
}

async function queryWikidata(query) {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/sparql-results+json',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': `ChrononautAnswerKB/1.0 (${CONTACT})`
        },
        signal: AbortSignal.timeout(90000)
      });
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 180)}`);
        if (response.status === 429 || response.status === 503) {
          const retryAfter = Number(response.headers.get('retry-after'));
          error.retryAfterMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : undefined;
        }
        throw error;
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      const wait = Math.min(120000, error.retryAfterMs || DELAY_MS * (2 ** attempt));
      console.warn(`  retry ${attempt + 1}/5 in ${wait}ms: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }
  throw lastError;
}

function yearFromBinding(binding) {
  if (!binding?.value) return undefined;
  const match = binding.value.match(/^([+-]?\d{1,6})/);
  return match ? Number(match[1]) : undefined;
}
function tierFromSitelinks(value) {
  const n = Number(value) || 0;
  if (n >= 100) return 'Common';
  if (n >= 25) return 'Uncommon';
  if (n >= 5) return 'Rare';
  return 'Paradox';
}
function pointsFromSitelinks(value, tier) {
  const n = Number(value) || 0;
  const ranges = { Common: [15, 30], Uncommon: [31, 58], Rare: [59, 82], Paradox: [83, 100] };
  const [low, high] = ranges[tier];
  const score = Math.max(0, Math.min(1, 1 - Math.log1p(n) / Math.log(1001)));
  return Math.round(low + (high - low) * score);
}

const entities = new Map();
let requests = 0;
for (const job of jobsByKey.values()) {
  console.log(`Import ${job.classId} (${job.poolIds.join(', ')})`);
  for (let offset = 0; offset < MAX_PER_CATEGORY; offset += PAGE_SIZE) {
    const limit = Math.min(PAGE_SIZE, MAX_PER_CATEGORY - offset);
    const payload = await queryWikidata(makeQuery(job, limit, offset));
    requests++;
    const bindings = payload.results?.bindings || [];
    for (const row of bindings) {
      const match = row.item?.value?.match(/entity\/(Q\d+)$/);
      if (!match || !row.itemLabel?.value) continue;
      const id = match[1];
      const entity = entities.get(id) || {
        wikidataId: id,
        label: row.itemLabel.value,
        aliases: [],
        classes: [],
        facts: {},
        source: 'Wikidata'
      };
      if (!entity.aliases.includes(row.itemLabel.value) && row.itemLabel.value !== entity.label) entity.aliases.push(row.itemLabel.value);
      const aliases = row.aliases?.value ? row.aliases.value.split('|') : [];
      for (const alias of aliases) {
        if (alias && alias !== entity.label && !entity.aliases.includes(alias)) entity.aliases.push(alias);
      }
      if (!entity.classes.includes(job.classId)) entity.classes.push(job.classId);
      const sitelinks = Number(row.sitelinks?.value) || 0;
      entity.sitelinks = Math.max(entity.sitelinks || 0, sitelinks);
      for (const propertyId of job.dateProperties) {
        const year = yearFromBinding(row[propertyVariable(propertyId).slice(1)]);
        if (year !== undefined) {
          if (propertyId === 'P569') { entity.facts.birthYear = year; entity.facts.dateYear ??= year; }
          else if (propertyId === 'P570') entity.facts.deathYear = year;
          else entity.facts.dateYear = year;
        }
      }
      entity.facts.countryNames ||= [];
      entity.facts.associationNames ||= [];
      for (const key of ['originCountry', 'birthCountry']) {
        const idMatch = row[key]?.value?.match(/entity\/(Q\d+)$/);
        if (idMatch) {
          entity.facts.countryIds ||= [];
          if (!entity.facts.countryIds.includes(idMatch[1])) entity.facts.countryIds.push(idMatch[1]);
        }
        const label = row[`${key}Label`]?.value;
        if (label && !entity.facts.countryNames.includes(label)) entity.facts.countryNames.push(label);
      }
      const publisherId = row.publisher?.value?.match(/entity\/(Q\d+)$/)?.[1];
      const publisherLabel = row.publisherLabel?.value;
      if (publisherId) {
        entity.facts.publisherIds ||= [];
        if (!entity.facts.publisherIds.includes(publisherId)) entity.facts.publisherIds.push(publisherId);
      }
      if (publisherLabel && !entity.facts.associationNames.includes(publisherLabel)) entity.facts.associationNames.push(publisherLabel);
      if (row.director?.value) {
        const directorMatch = row.director.value.match(/entity\/(Q\d+)$/);
        if (directorMatch) {
          entity.facts.directorIds ||= [];
          if (!entity.facts.directorIds.includes(directorMatch[1])) entity.facts.directorIds.push(directorMatch[1]);
        }
      }
      if (row.directorLabel?.value && !entity.facts.associationNames.includes(row.directorLabel.value)) {
        entity.facts.associationNames.push(row.directorLabel.value);
      }
      entities.set(id, entity);
    }
    console.log(`  ${Math.min(offset + bindings.length, MAX_PER_CATEGORY)} / ${MAX_PER_CATEGORY}; ${entities.size} unique entities total`);
    if (bindings.length < limit) break;
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
}

const records = [...entities.values()].map(entity => {
  entity.aliases = entity.aliases.filter(alias => alias !== entity.label).slice(0, 80);
  entity.tier = tierFromSitelinks(entity.sitelinks);
  entity.points = pointsFromSitelinks(entity.sitelinks, entity.tier);
  return entity;
}).sort((a, b) => a.label.localeCompare(b.label));
const output = {
  schemaVersion: 1,
  version: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  source: 'Wikidata Query Service',
  license: 'Wikidata structured data is released under CC0. This export contains labels, aliases, class IDs, selected factual properties and source identifiers.',
  import: { requests, categories: jobsByKey.size, maxPerCategory: MAX_PER_CATEGORY, languages: LANGUAGES },
  entities: records
};
await fs.writeFile(OUTPUT_FILE, JSON.stringify(output));
console.log(`\nDone: ${records.length.toLocaleString()} unique entities from ${jobsByKey.size} class/filter jobs (${requests} requests).`);
console.log(`Written: ${OUTPUT_FILE}`);
console.log('Review a sample and run the test suite before deploying the generated archive.');

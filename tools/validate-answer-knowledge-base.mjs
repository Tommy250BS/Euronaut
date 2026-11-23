#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'answer-knowledge-base.json');
const allowEmpty = process.argv.includes('--allow-empty');
const db = JSON.parse(await fs.readFile(file, 'utf8'));
const errors = [];
if (db.schemaVersion !== 1) errors.push('unsupported schemaVersion');
if (!Array.isArray(db.entities)) errors.push('entities must be an array');
const ids = new Set();
const aliases = new Map();
for (const [index, entity] of (db.entities || []).entries()) {
  const where = `entity[${index}]`;
  if (!/^Q\d+$/.test(entity.wikidataId || '')) errors.push(`${where}: missing Wikidata QID`);
  if (ids.has(entity.wikidataId)) errors.push(`${where}: duplicate QID ${entity.wikidataId}`);
  ids.add(entity.wikidataId);
  if (!entity.label || typeof entity.label !== 'string') errors.push(`${where}: missing label`);
  if (!Array.isArray(entity.aliases) || entity.aliases.some(alias => typeof alias !== 'string' || !alias.trim())) errors.push(`${where}: aliases must be non-empty strings`);
  if (!Array.isArray(entity.classes) || !entity.classes.length || entity.classes.some(id => !/^Q\d+$/.test(id))) errors.push(`${where}: invalid class IDs`);
  if (!['Common', 'Uncommon', 'Rare', 'Paradox'].includes(entity.tier)) errors.push(`${where}: invalid rarity tier`);
  if (!Number.isFinite(Number(entity.points)) || Number(entity.points) < 15 || Number(entity.points) > 100) errors.push(`${where}: points outside 15–100`);
  if (!entity.source) errors.push(`${where}: missing source provenance`);
  for (const label of [entity.label, ...(entity.aliases || [])]) {
    const key = label.trim().toLocaleLowerCase();
    aliases.set(key, (aliases.get(key) || 0) + 1);
  }
}
if (!allowEmpty && !(db.entities || []).length) errors.push('knowledge base is empty; run the Wikidata importer first');
const ambiguousAliases = [...aliases.values()].filter(count => count > 1).length;
if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue(s):`);
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Valid: ${(db.entities || []).length.toLocaleString()} entities, ${aliases.size.toLocaleString()} unique raw labels, ${ambiguousAliases.toLocaleString()} ambiguous raw labels.`);
console.log(`Source: ${db.source || 'unspecified'} · Version: ${db.version || 'unspecified'}`);

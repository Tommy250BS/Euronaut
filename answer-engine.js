/* Chrononaut Answer Recognition Engine
 * Resolves player input to canonical entities, then validates the entity against
 * explicit question criteria. It never treats fuzzy similarity as factual proof.
 */
(function (global) {
  'use strict';

  const STOP_WORDS = new Set(['the', 'a', 'an']);
  const TIERS = ['Common', 'Uncommon', 'Rare', 'Paradox'];

  function normalize(value) {
    const tokens = String(value ?? '').toLocaleLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ß/g, 'ss').replace(/æ/g, 'ae').replace(/œ/g, 'oe')
      .replace(/&/g, ' and ').replace(/[^\p{L}\p{N}+#]+/gu, ' ')
      .trim().split(/\s+/).filter(Boolean);
    if (tokens.length && STOP_WORDS.has(tokens[0])) tokens.shift();
    return tokens.join(' ');
  }

  function editDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prevPrev = null;
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const current = [i];
      for (let j = 1; j <= b.length; j++) {
        current[j] = Math.min(current[j - 1] + 1, previous[j] + 1,
          previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          current[j] = Math.min(current[j], (prevPrev?.[j - 2] ?? Infinity) + 1);
        }
      }
      prevPrev = previous;
      previous = current;
    }
    return previous[b.length];
  }

  function uniqueById(items) {
    const seen = new Set();
    return items.filter(item => {
      const id = item.wikidataId || item.id || item.name;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function getLabels(entity) {
    return [entity.label, entity.name, ...(Array.isArray(entity.aliases) ? entity.aliases : [])]
      .filter(value => typeof value === 'string' && value.trim());
  }

  function dateMatches(year, dateRule) {
    if (!dateRule) return true;
    if (!Number.isFinite(Number(year))) return false;
    const value = Number(year);
    if (dateRule.before !== undefined && !(value < Number(dateRule.before))) return false;
    if (dateRule.after !== undefined && !(value > Number(dateRule.after))) return false;
    if (dateRule.onOrBefore !== undefined && !(value <= Number(dateRule.onOrBefore))) return false;
    if (dateRule.onOrAfter !== undefined && !(value >= Number(dateRule.onOrAfter))) return false;
    return true;
  }

  function criteriaMatch(entity, criteria) {
    if (!criteria) return false;
    const classes = new Set(entity.classes || entity.classIds || []);
    if (Array.isArray(criteria.classesAny) && criteria.classesAny.length && !criteria.classesAny.some(id => classes.has(id))) return false;
    if (Array.isArray(criteria.classesAll) && !criteria.classesAll.every(id => classes.has(id))) return false;
    const facts = entity.facts || {};
    if (!dateMatches(facts.dateYear, criteria.date)) return false;
    if (criteria.lifePeriod) {
      const birth = Number(facts.birthYear);
      const death = facts.deathYear == null ? new Date().getUTCFullYear() : Number(facts.deathYear);
      if (!Number.isFinite(birth) || birth >= Number(criteria.lifePeriod.birthBefore) ||
          !Number.isFinite(death) || death <= Number(criteria.lifePeriod.deathAfter)) return false;
    }
    if (criteria.directorIds?.length && !criteria.directorIds.some(id => (facts.directorIds || []).includes(id))) return false;
    if (criteria.countryIds?.length && !criteria.countryIds.some(id => (facts.countryIds || []).includes(id))) return false;
    if (criteria.mustHave && !criteria.mustHave.every(key => facts[key] !== undefined && facts[key] !== null && facts[key] !== '')) return false;
    return true;
  }

  function constraintMatches(entity, variant) {
    if (!variant) return true;
    const parts = Array.isArray(variant.allOf) ? variant.allOf
      : Array.isArray(variant.anyOf) ? variant.anyOf : [variant];
    const mode = Array.isArray(variant.allOf) ? 'all' : Array.isArray(variant.anyOf) ? 'any' : 'single';
    const metadata = {
      temporalYear: entity.facts?.dateYear,
      origin: entity.facts?.countryNames || [],
      associations: entity.facts?.associationNames || []
    };
    const tests = parts.map(part => {
      if (part.type === 'temporal') return dateMatches(metadata.temporalYear, {
        before: part.direction === 'before' ? part.year : undefined,
        after: part.direction === 'after' ? part.year : undefined,
        onOrBefore: part.direction === 'on-or-before' ? part.year : undefined,
        onOrAfter: part.direction === 'on-or-after' ? part.year : undefined
      });
      if (part.type === 'origin') return metadata.origin.some(value => {
        const candidate = normalize(value), target = normalize(part.origin);
        return candidate === target || (` ${candidate} `).includes(` ${target} `);
      });
      if (part.type === 'associative') return metadata.associations.some(value => {
        const candidate = normalize(value), target = normalize(part.person);
        return candidate === target || (` ${candidate} `).includes(` ${target} `);
      });
      return false;
    });
    return mode === 'all' ? tests.every(Boolean) : mode === 'any' ? tests.some(Boolean) : !!tests[0];
  }

  function rarityAllowed(tier, mode) {
    if (mode === 'mainstream') return ['Common', 'Uncommon'].includes(tier);
    if (mode === 'niche') return ['Rare', 'Paradox'].includes(tier);
    return TIERS.includes(tier);
  }

  function toGameAnswer(entity, question) {
    const tier = TIERS.includes(entity.tier) ? entity.tier : 'Uncommon';
    const maxPoints = Math.max(15, Number(question.maxAnswerPoints) || 100);
    const pointsByTier = { Common: 24, Uncommon: 48, Rare: 72, Paradox: 90 };
    const points = Math.min(maxPoints, Math.max(15, Number(entity.points) || pointsByTier[tier]));
    const year = entity.facts?.dateYear;
    return {
      id: entity.wikidataId || entity.id,
      name: entity.label || entity.name,
      aliases: entity.aliases || [],
      year: Number.isFinite(Number(year)) ? String(Math.abs(Number(year))) + (Number(year) < 0 ? ' BC' : ' AD') : 'Verified entry',
      points, tier,
      fact: `Accepted from the Chrononaut knowledge base (${entity.source || 'Wikidata'}).`,
      metadata: {
        temporalYear: Number.isFinite(Number(year)) ? Number(year) : undefined,
        origin: entity.facts?.countryNames || [],
        associations: entity.facts?.associationNames || [],
        externalId: entity.wikidataId,
        source: entity.source || 'Wikidata'
      },
      knowledgeBaseMatch: true
    };
  }

  let database = { entities: [] };
  let readyPromise = Promise.resolve(false);
  let aliasIndex = null;
  let lengthIndex = null;

  function setDatabase(payload) {
    database = payload && Array.isArray(payload.entities) ? payload : { entities: [] };
    aliasIndex = new Map();
    lengthIndex = new Map();
    for (const entity of database.entities) {
      for (const label of getLabels(entity)) {
        const key = normalize(label);
        if (!key) continue;
        if (!aliasIndex.has(key)) aliasIndex.set(key, []);
        aliasIndex.get(key).push(entity);
        if (!lengthIndex.has(key.length)) lengthIndex.set(key.length, new Set());
        lengthIndex.get(key.length).add(key);
      }
    }
    return database.entities.length;
  }

  function load(url = 'answer-knowledge-base.json') {
    if (typeof global.fetch !== 'function') return readyPromise = Promise.resolve(false);
    readyPromise = global.fetch(url, { cache: 'no-cache' }).then(response => {
      if (!response.ok) throw new Error(`Knowledge base HTTP ${response.status}`);
      return response.json();
    }).then(payload => { setDatabase(payload); return true; })
      .catch(error => { console.warn('[Chrononaut] Knowledge base unavailable; curated answers remain active.', error); return false; });
    return readyPromise;
  }

  function curatedMatch(input, answers) {
    const exact = [];
    for (const answer of answers || []) {
      if (getLabels(answer).some(label => normalize(label) === input)) exact.push(answer);
    }
    const unique = uniqueById(exact);
    if (unique.length === 1) return unique[0];
    if (unique.length > 1) return null;
    let best = null, bestDistance = Infinity, ambiguous = false;
    for (const answer of answers || []) for (const label of getLabels(answer)) {
      const candidate = normalize(label);
      if (candidate.length < 5 || Math.abs(candidate.length - input.length) > 2) continue;
      const distance = editDistance(input, candidate);
      const allowance = candidate.length >= 10 ? 2 : 1;
      if (distance > allowance) continue;
      if (distance < bestDistance) { best = answer; bestDistance = distance; ambiguous = false; }
      else if (distance === bestDistance && best !== answer) ambiguous = true;
    }
    return ambiguous ? null : best;
  }

  function knowledgeMatch(input, question) {
    if (!question?.answerCriteria || !aliasIndex) return null;
    let candidates = aliasIndex.get(input) || [];
    if (!candidates.length && input.length >= 6) {
      let bestDistance = Infinity;
      const fuzzy = [];
      const possibleLabels = new Set();
      for (let length = Math.max(6, input.length - 1); length <= input.length + 1; length++) {
        for (const label of lengthIndex?.get(length) || []) possibleLabels.add(label);
      }
      for (const label of possibleLabels) {
        // A one-character typo normally preserves either the first or next two characters.
        if (label[0] !== input[0] && label.slice(1, 3) !== input.slice(1, 3)) continue;
        const distance = editDistance(input, label);
        const allowance = label.length >= 12 ? 2 : 1;
        if (distance > allowance) continue;
        if (distance < bestDistance) { bestDistance = distance; fuzzy.length = 0; fuzzy.push(...(aliasIndex.get(label) || [])); }
        else if (distance === bestDistance) fuzzy.push(...(aliasIndex.get(label) || []));
      }
      candidates = fuzzy;
    }
    const valid = uniqueById(candidates.filter(entity =>
      criteriaMatch(entity, question.answerCriteria) &&
      rarityAllowed(entity.tier, question.rarityMode) &&
      constraintMatches(entity, question.activeConstraint)
    ));
    if (valid.length !== 1) return null;
    return toGameAnswer(valid[0], question);
  }

  function match(rawInput, question) {
    const input = normalize(rawInput);
    if (!input) return null;
    const known = curatedMatch(input, question?.answers || []);
    if (known) return known;
    return knowledgeMatch(input, question);
  }

  global.AnswerRecognition = Object.freeze({ load, ready: () => readyPromise, setDatabase, match, normalize,
    get stats() { return { entities: database.entities.length, indexedAliases: aliasIndex?.size || 0, version: database.version || null }; }
  });
})(window);

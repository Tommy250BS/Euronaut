/* Chrononaut Question Engine v2
 * Deterministic, data-agnostic expedition generation. Content facts are never
 * inferred by the engine: generated constraints require explicit metadata.
 */
(function (global) {
  'use strict';

  const TIERS = Object.freeze(['Common', 'Uncommon', 'Rare', 'Paradox']);
  const TIER_SCORE = Object.freeze({ Common: 1, Uncommon: 2, Rare: 3, Paradox: 4 });
  const RARITY_MODES = Object.freeze({
    mainstream: { label: 'Mainstream', tiers: ['Common', 'Uncommon'] },
    balanced: { label: 'Balanced', tiers: TIERS },
    niche: { label: 'Niche', tiers: ['Rare', 'Paradox'] }
  });
  const WILDCARDS = Object.freeze([
    { type: 'speed-run', label: 'Speed Run · 15 seconds', description: 'The clock is shortened to 15 seconds.', duration: 15, weight: 1 },
    { type: 'inverse-rarity', label: 'Inverse Rarity', description: 'Accessible answers are worth more fuel than obscure ones.', weight: 1 },
    { type: 'double-or-nothing', label: 'Double or Nothing', description: 'A correct answer doubles the accumulated fuel; a miss forfeits it.', weight: 1 }
  ]);
  const DEFAULTS = Object.freeze({
    runCount: 2, jumpsPerRun: 7, domainMixing: true, collectionMixing: true, rarity: 'balanced',
    wildcard: true, baseDuration: 25, minAnswersForConstraint: 3,
    seed: 20261122, constraintChance: 0.7, avoidRepeatPoolsAcrossRuns: true
  });

  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < String(value).length; i++) {
      hash ^= String(value).charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function seededRandom(seed) {
    let state = (Number(seed) >>> 0) || 1;
    return function random() {
      state += 0x6D2B79F5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(items, random) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function pick(items, random) {
    return items.length ? items[Math.floor(random() * items.length)] : null;
  }
  function clampInt(value, fallback, min, max) {
    const number = Math.floor(Number(value));
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }
  function normalizeTokens(value) {
    return String(value ?? '').toLocaleLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ')
      .replace(/[^a-z0-9+#]+/g, ' ').replace(/\b(the|a|an)\b/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function includesEntity(values, expected) {
    const target = normalizeTokens(expected);
    if (!target) return false;
    const list = Array.isArray(values) ? values : [values];
    return list.some(value => {
      const candidate = normalizeTokens(value);
      return candidate === target || (` ${candidate} `).includes(` ${target} `);
    });
  }

  function levenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i++) {
      const current = [i];
      for (let j = 1; j <= b.length; j++) {
        current[j] = Math.min(current[j - 1] + 1, previous[j] + 1,
          previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      previous = current;
    }
    return previous[b.length];
  }
  function matchAnswer(rawInput, answers, settings = {}) {
    const input = normalizeTokens(rawInput);
    if (!input || !Array.isArray(answers)) return null;
    for (const answer of answers) {
      const labels = [answer?.name, ...(Array.isArray(answer?.aliases) ? answer.aliases : [])];
      if (labels.some(label => normalizeTokens(label) === input)) return answer;
    }
    if (settings.fuzzy === false) return null;
    let best = null;
    let bestDistance = Infinity;
    let ambiguous = false;
    for (const answer of answers) {
      const labels = [answer?.name, ...(Array.isArray(answer?.aliases) ? answer.aliases : [])];
      for (const label of labels) {
        const candidate = normalizeTokens(label);
        if (candidate.length < 5 || Math.abs(candidate.length - input.length) > 2) continue;
        const allowance = candidate.length >= 10 ? 2 : 1;
        const distance = levenshteinDistance(input, candidate);
        if (distance > allowance) continue;
        if (distance < bestDistance) { best = answer; bestDistance = distance; ambiguous = false; }
        else if (distance === bestDistance && best !== answer) ambiguous = true;
      }
    }
    return ambiguous ? null : best;
  }

  const CONSTRAINTS = Object.freeze({
    temporal: {
      prompt: rule => rule.prompt || `Name a ${rule.subject || 'entry'} with a recorded year ${rule.direction} ${rule.year}.`,
      accepts: (answer, rule) => {
        const year = Number(answer.metadata?.temporalYear);
        const threshold = Number(rule.year);
        if (!Number.isFinite(year) || !Number.isFinite(threshold)) return false;
        if (rule.direction === 'after') return year > threshold;
        if (rule.direction === 'before') return year < threshold;
        if (rule.direction === 'on-or-after') return year >= threshold;
        if (rule.direction === 'on-or-before') return year <= threshold;
        return false;
      }
    },
    origin: {
      prompt: rule => rule.prompt || `Name a ${rule.subject || 'entry'} originating in ${rule.origin}${rule.before ? ` before ${rule.before}` : ''}.`,
      accepts: (answer, rule) => {
        if (!includesEntity(answer.metadata?.origin, rule.origin)) return false;
        if (!rule.before) return true;
        const year = Number(answer.metadata?.temporalYear);
        return Number.isFinite(year) && year < Number(rule.before);
      }
    },
    associative: {
      prompt: rule => {
        const period = rule.period || (rule.periodFrom !== undefined && rule.periodTo !== undefined
          ? ` between ${rule.periodFrom} and ${rule.periodTo}`
          : rule.periodFrom !== undefined ? ` from ${rule.periodFrom} onward`
            : rule.periodTo !== undefined ? ` through ${rule.periodTo}` : '');
        return rule.prompt || `Name a ${rule.subject || 'entry'} that ${rule.relation || 'is associated with'} ${rule.person}${period}.`;
      },
      accepts: (answer, rule) => {
        if (!includesEntity(answer.metadata?.associations, rule.person)) return false;
        const year = Number(answer.metadata?.temporalYear);
        if (rule.periodFrom !== undefined && (!Number.isFinite(year) || year < Number(rule.periodFrom))) return false;
        if (rule.periodTo !== undefined && (!Number.isFinite(year) || year > Number(rule.periodTo))) return false;
        return true;
      }
    }
  });

  function flattenPools(collections) {
    const pools = [];
    (Array.isArray(collections) ? collections : []).forEach((collection, collectionIndex) => {
      (Array.isArray(collection?.rounds) ? collection.rounds : []).forEach((pool, poolIndex) => {
        if (!pool || typeof pool !== 'object') return;
        const generatedId = `${collection.id || `collection-${collectionIndex + 1}`}-${pool.id || `pool-${poolIndex + 1}`}`;
        pools.push({
          ...pool,
          answers: Array.isArray(pool.answers) ? pool.answers : [],
          id: pool.id || generatedId,
          era: pool.era || pool.domain || collection.id || `Domain ${collectionIndex + 1}`,
          domain: pool.domain || pool.era || collection.id || `Domain ${collectionIndex + 1}`,
          subject: pool.subject || 'entry',
          sourceCollection: collection.id || `collection-${collectionIndex + 1}`
        });
      });
    });
    return pools;
  }

  function validatePool(pool) {
    const errors = [];
    if (!pool.prompt && !pool.template) errors.push('missing prompt/template');
    if (!Array.isArray(pool.answers) || pool.answers.length === 0) errors.push('no answers');
    if (!pool.domain) errors.push('missing domain');
    if (pool.constraintVariants != null && !Array.isArray(pool.constraintVariants)) errors.push('constraintVariants must be an array');
    (Array.isArray(pool.constraintVariants) ? pool.constraintVariants : []).forEach((variant, index) => {
      if (!variant || typeof variant !== 'object') { errors.push(`constraint ${index + 1}: invalid variant`); return; }
      if (Array.isArray(variant.allOf) && Array.isArray(variant.anyOf)) errors.push(`constraint ${index + 1}: use allOf or anyOf, not both`);
      const parts = Array.isArray(variant.allOf) ? variant.allOf : Array.isArray(variant.anyOf) ? variant.anyOf : [variant];
      if (!parts.length) errors.push(`constraint ${index + 1}: empty rule group`);
      parts.forEach(part => {
        if (!part || typeof part !== 'object' || !CONSTRAINTS[part.type]) errors.push(`constraint ${index + 1}: unsupported rule type`);
      });
    });
    const tokenOwners = new Map();
    (pool.answers || []).forEach((answer, index) => {
      const label = answer?.name || `answer ${index + 1}`;
      if (typeof answer?.name !== 'string' || !answer.name.trim()) errors.push(`${label}: missing or invalid name`);
      const key = normalizeTokens(answer?.name);
      if (key && tokenOwners.has(key) && tokenOwners.get(key) !== index) errors.push(`duplicate answer name: ${answer.name}`);
      if (key) tokenOwners.set(key, index);
      if (!Number.isFinite(Number(answer?.points)) || Number(answer.points) < 0 || Number(answer.points) > 100) errors.push(`${label}: points must be between 0 and 100`);
      if (!TIERS.includes(answer?.tier)) errors.push(`${label}: unknown tier`);
      if (answer?.aliases != null && !Array.isArray(answer.aliases)) errors.push(`${label}: aliases must be an array`);
      (Array.isArray(answer?.aliases) ? answer.aliases : []).forEach(alias => {
        const aliasKey = normalizeTokens(alias);
        if (!aliasKey) errors.push(`${label}: empty alias`);
        else if (tokenOwners.has(aliasKey) && tokenOwners.get(aliasKey) !== index) errors.push(`alias collision: ${alias}`);
        else tokenOwners.set(aliasKey, index);
      });
      if (answer?.metadata?.temporalYear !== undefined && !Number.isFinite(Number(answer.metadata.temporalYear))) {
        errors.push(`${label}: temporalYear must be numeric`);
      }
    });
    return errors;
  }

  function eligibleAnswers(pool, rarityMode) {
    const mode = RARITY_MODES[rarityMode] || RARITY_MODES.balanced;
    return pool.answers.filter(answer => mode.tiers.includes(answer.tier));
  }
  function constraintParts(variant) {
    if (!variant || typeof variant !== 'object') return { mode: 'single', parts: [] };
    if (Array.isArray(variant.allOf) && variant.allOf.length) return { mode: 'all', parts: variant.allOf };
    if (Array.isArray(variant.anyOf) && variant.anyOf.length) return { mode: 'any', parts: variant.anyOf };
    return { mode: 'single', parts: [variant] };
  }
  function acceptsConstraint(answer, variant) {
    const { mode, parts } = constraintParts(variant);
    const checks = parts.map(part => !!CONSTRAINTS[part.type] && CONSTRAINTS[part.type].accepts(answer, part));
    return mode === 'all' ? checks.every(Boolean) : mode === 'any' ? checks.some(Boolean) : !!checks[0];
  }
  function constraintPrompt(variant) {
    if (variant.prompt) return variant.prompt;
    const { mode, parts } = constraintParts(variant);
    if (mode === 'single') return CONSTRAINTS[parts[0].type].prompt({ ...variant, ...parts[0] });
    const subject = variant.subject || 'entry';
    const clauses = parts.map(part => {
      if (part.prompt) return part.prompt.replace(/^Name a [^.]+?\s+/i, '').replace(/[.]$/, '');
      const rule = CONSTRAINTS[part.type];
      const prompt = rule.prompt({ ...variant, ...part });
      return prompt.replace(/^Name a [^.]+?\s+/i, '').replace(/[.]$/, '');
    });
    return `Name a ${subject} ${clauses.join(mode === 'all' ? ' and ' : ' or ')}.`;
  }
  function chooseConstraint(pool, answers, random, minAnswers) {
    const variants = Array.isArray(pool.constraintVariants) ? pool.constraintVariants : [];
    const viable = variants.map(variant => {
      if (!variant || typeof variant !== 'object') return null;
      if (Array.isArray(variant.allOf) && Array.isArray(variant.anyOf)) return null;
      const { parts } = constraintParts(variant);
      if (!parts.length || parts.some(part => !part || typeof part !== 'object' || !CONSTRAINTS[part.type])) return null;
      const matches = answers.filter(answer => acceptsConstraint(answer, variant));
      return matches.length >= minAnswers ? { variant, answers: matches } : null;
    }).filter(Boolean);
    return pick(viable, random);
  }
  function interpolate(template, pool) {
    return String(template).replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => pool[key] ?? '');
  }
  function buildQuestion(pool, options, random) {
    const question = {
      ...pool,
      answers: pool.answers.map(answer => ({
        ...answer,
        aliases: Array.isArray(answer.aliases) ? answer.aliases.slice() : [],
        metadata: answer.metadata ? { ...answer.metadata } : undefined
      }))
    };
    question.answers = eligibleAnswers(question, options.rarity);
    const constraint = random() <= options.constraintChance
      ? chooseConstraint(question, question.answers, random, options.minAnswersForConstraint) : null;
    if (constraint) {
      question.answers = constraint.answers;
      question.activeConstraint = constraint.variant;
      question.prompt = constraintPrompt(constraint.variant);
      question.constraint = constraint.variant.label || constraint.variant.type || 'Combined constraint';
      question.constraintType = Array.isArray(constraint.variant.allOf) || Array.isArray(constraint.variant.anyOf)
        ? 'combined' : constraint.variant.type;
    } else if (typeof pool.template === 'function') question.prompt = pool.template(pool);
    else if (typeof pool.template === 'string') question.prompt = interpolate(pool.template, pool);
    question.rarityMode = options.rarity;
    question.duration = Number(pool.duration) > 0 ? Number(pool.duration) : options.baseDuration;
    question.hint = question.hint || 'Explore the archive for a valid answer.';
    question.constraint = question.constraint || pool.constraint || 'Open archive';
    question.maxAnswerPoints = Math.max(0, ...question.answers.map(answer => Number(answer.points) || 0));
    return question;
  }

  function selectPools(allPools, options, random, usedAcrossRuns) {
    const candidates = allPools.filter(pool => validatePool(pool).length === 0 && eligibleAnswers(pool, options.rarity).length > 0);
    const remaining = shuffle(candidates, random);
    const selected = [];
    const domainCounts = new Map();
    const collectionCounts = new Map();
    const poolUseCounts = usedAcrossRuns || new Map();
    const distinctDomains = new Set(remaining.map(pool => pool.domain)).size;
    while (selected.length < options.jumpsPerRun && remaining.length) {
      let bestScore = -Infinity;
      let bestIndices = [];
      remaining.forEach((pool, index) => {
        const domainCount = domainCounts.get(pool.domain) || 0;
        const collectionCount = collectionCounts.get(pool.sourceCollection) || 0;
        const previousUse = poolUseCounts.get(pool.id) || 0;
        const score = (options.domainMixing ? -domainCount * (distinctDomains >= options.jumpsPerRun ? 1000 : 100) : 0)
          - (options.collectionMixing ? collectionCount * 8 : 0)
          - previousUse * (options.avoidRepeatPoolsAcrossRuns ? 18 : 0)
          + random() * 0.25;
        if (score > bestScore + 1e-9) { bestScore = score; bestIndices = [index]; }
        else if (Math.abs(score - bestScore) <= 1e-9) bestIndices.push(index);
      });
      const chosenIndex = pick(bestIndices, random);
      const [chosen] = remaining.splice(chosenIndex, 1);
      selected.push(chosen);
      domainCounts.set(chosen.domain, (domainCounts.get(chosen.domain) || 0) + 1);
      collectionCounts.set(chosen.sourceCollection, (collectionCounts.get(chosen.sourceCollection) || 0) + 1);
      poolUseCounts.set(chosen.id, (poolUseCounts.get(chosen.id) || 0) + 1);
    }
    return selected;
  }

  function calculateFuel(answer, roundData) {
    if (!answer) return 0;
    const points = Math.max(0, Number(answer.points) || 0);
    let fuel = points;
    if (roundData?.modifier?.type === 'inverse-rarity') fuel = Math.max(15, 115 - points);
    else if (roundData?.rarityMode === 'mainstream') fuel = Math.max(10, Math.round(15 + (points - 15) * 0.7));
    return Math.max(0, Math.round(fuel));
  }

  function getRunMaxFuel(run) {
    const rounds = run?.rounds || [];
    let total = 0;
    let doubleIndex = -1;
    rounds.forEach((round, index) => {
      const best = round.answers.reduce((winner, answer) => {
        return calculateFuel(answer, round) > calculateFuel(winner, round) ? answer : winner;
      }, null);
      total += calculateFuel(best, round);
      if (round.modifier?.type === 'double-or-nothing') doubleIndex = index;
    });
    if (doubleIndex >= 0) {
      let bankedMaximum = 0;
      for (let i = 0; i < doubleIndex; i++) {
        const round = rounds[i];
        const best = round.answers.reduce((winner, answer) => calculateFuel(answer, round) > calculateFuel(winner, round) ? answer : winner, null);
        bankedMaximum += calculateFuel(best, round);
      }
      total += bankedMaximum;
    }
    return total;
  }

  function createRuns(content, suppliedOptions = {}) {
    const options = { ...DEFAULTS, ...suppliedOptions };
    options.runCount = clampInt(options.runCount, DEFAULTS.runCount, 1, 100);
    options.jumpsPerRun = clampInt(options.jumpsPerRun, DEFAULTS.jumpsPerRun, 1, 50);
    options.baseDuration = Math.max(1, Number(options.baseDuration) || DEFAULTS.baseDuration);
    options.minAnswersForConstraint = clampInt(options.minAnswersForConstraint, DEFAULTS.minAnswersForConstraint, 1, 100);
    const requestedConstraintChance = Number(options.constraintChance ?? DEFAULTS.constraintChance);
    options.constraintChance = Number.isFinite(requestedConstraintChance)
      ? Math.max(0, Math.min(1, requestedConstraintChance)) : DEFAULTS.constraintChance;
    if (!RARITY_MODES[options.rarity]) options.rarity = 'balanced';
    const allPools = flattenPools(content);
    const diagnostics = allPools.flatMap(pool => validatePool(pool).map(message => `${pool.id}: ${message}`));
    if (!allPools.length) return [];
    const usedAcrossRuns = new Map();
    const archiveFingerprint = hashString(allPools.map(pool => `${pool.id}:${pool.prompt}:${pool.answers.map(answer => `${answer.name}:${answer.tier}:${answer.points}:${JSON.stringify(answer.metadata || {})}`).join(',')}:${JSON.stringify(pool.constraintVariants || [])}`).join('|'));

    return Array.from({ length: options.runCount }, (_, runIndex) => {
      const seed = (Number(options.seed) + archiveFingerprint + runIndex * 104729) >>> 0;
      const random = seededRandom(seed);
      const selected = selectPools(allPools, options, random, usedAcrossRuns);
      const rounds = selected.map(pool => buildQuestion(pool, options, random));
      const wildcard = options.wildcard ? pick(WILDCARDS, random) : null;
      const wildcardIndex = wildcard && rounds.length ? Math.floor(random() * rounds.length) : -1;
      if (wildcardIndex >= 0) {
        rounds[wildcardIndex].modifier = wildcard;
        if (wildcard.duration) rounds[wildcardIndex].duration = wildcard.duration;
      }
      rounds.forEach(round => {
        if (round.rarityMode === 'mainstream') round.hint = `${round.hint} Mainstream run: accessible entries are in focus.`;
        if (round.rarityMode === 'niche') round.hint = `${round.hint} Niche run: seek specialist-level entries.`;
      });
      const run = {
        id: `EXPEDITION #${String(runIndex + 1).padStart(2, '0')}`,
        rounds,
        settings: { rarity: options.rarity, domainMixing: !!options.domainMixing, collectionMixing: !!options.collectionMixing, wildcard: !!wildcard, seed },
        diagnostics: runIndex === 0 ? diagnostics : []
      };
      run.maxFuel = getRunMaxFuel(run);
      run.archiveStats = {
        candidatePools: allPools.filter(pool => validatePool(pool).length === 0 && eligibleAnswers(pool, options.rarity).length).length,
        selectedPools: rounds.length,
        distinctDomains: new Set(rounds.map(round => round.domain)).size,
        constrainedRounds: rounds.filter(round => round.constraintType).length
      };
      return run;
    });
  }

  global.QuestionEngine = Object.freeze({
    createRuns, calculateFuel, getRunMaxFuel, validatePool, matchAnswer,
    rules: Object.freeze({ constraints: CONSTRAINTS, rarity: RARITY_MODES, tiers: TIERS, tierScore: TIER_SCORE }),
    wildcards: WILDCARDS
  });
})(window);

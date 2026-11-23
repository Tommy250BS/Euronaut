/* Run with: node tests/question-engine.test.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'question-engine.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'answer-engine.js'), 'utf8'), context);
const engine = context.window.QuestionEngine;
const archive = context.window.ChrononautContent.seeds;
const pools = archive.flatMap(collection => collection.rounds);
assert.equal(pools.length, 24, 'the curated archive should contain 24 pools');
assert.equal(archive.length, 12, 'the archive should provide twelve expedition source groups');
assert.ok(new Set(pools.map(pool => pool.domain)).size >= 20, 'domain labels should support broad cross-domain play');
assert.equal(new Set(pools.map(pool => pool.id)).size, pools.length, 'pool IDs must be unique');
assert.ok(pools.reduce((sum, pool) => sum + pool.answers.filter(answer => Number.isFinite(answer.metadata?.temporalYear)).length, 0) >= 380,
  'unambiguous temporal metadata should be available for most dated pools');
assert.ok(pools.reduce((count, pool) => count + (pool.constraintVariants?.length || 0), 0) >= 48,
  'temporal, origin, associative, and composite templates should be present');
assert.ok(pools.filter(pool => pool.constraintVariants?.length).length >= 20,
  'most dated pools should expose generated temporal templates');
assert.equal(pools.filter(pool => pool.answerCriteria).length, 19,
  'nineteen pools should have explicit criteria for external answer expansion');

for (const rarity of ['mainstream', 'balanced', 'niche']) {
  const allowed = rarity === 'mainstream'
    ? ['Common', 'Uncommon']
    : rarity === 'niche' ? ['Rare', 'Paradox'] : ['Common', 'Uncommon', 'Rare', 'Paradox'];
  const runs = engine.createRuns(archive, {
    runCount: 8, jumpsPerRun: 7, domainMixing: true,
    rarity, wildcard: true, seed: 42, constraintChance: 1
  });
  assert.equal(runs.length, 8);
  for (const run of runs) {
    assert.equal(run.rounds.length, 7);
    assert.equal(new Set(run.rounds.map(round => round.id)).size, 7, 'a run must never repeat a pool');
    assert.equal(run.rounds.filter(round => round.modifier).length, 1);
    const speedRound = run.rounds.find(round => round.modifier?.type === 'speed-run');
    if (speedRound) assert.equal(speedRound.duration, 15);
    assert.equal(run.diagnostics.length, 0);
    assert.equal(new Set(run.rounds.map(round => round.domain)).size, 7);
    assert.ok(run.rounds.every(round => round.answers.length > 0));
    assert.ok(run.rounds.every(round => round.answers.every(answer => allowed.includes(answer.tier))));
    assert.equal(run.maxFuel, engine.getRunMaxFuel(run));
    let simulatedPerfectRun = 0;
    for (const round of run.rounds) {
      const bestAnswer = round.answers.reduce((best, answer) => {
        return !best || engine.calculateFuel(answer, round) > engine.calculateFuel(best, round) ? answer : best;
      }, null);
      const answerFuel = engine.calculateFuel(bestAnswer, round);
      simulatedPerfectRun = round.modifier?.type === 'double-or-nothing'
        ? simulatedPerfectRun * 2 + answerFuel
        : simulatedPerfectRun + answerFuel;
    }
    assert.equal(run.maxFuel, simulatedPerfectRun, 'the HUD ceiling must equal a simulated perfect run');
    assert.ok(run.maxFuel > 0);
    assert.ok(run.archiveStats.distinctDomains >= 7);
  }
}

const metadataAnswers = [
  { name: 'A', points: 10, tier: 'Common', metadata: { temporalYear: 100, origin: 'Italy', associations: ['X'] } },
  { name: 'B', points: 20, tier: 'Uncommon', metadata: { temporalYear: 200, origin: 'Italy', associations: ['X'] } },
  { name: 'C', points: 30, tier: 'Rare', metadata: { temporalYear: 220, origin: 'Italy', associations: ['Y'] } },
  { name: 'D', points: 40, tier: 'Paradox', metadata: { temporalYear: 400, origin: 'France', associations: ['X'] } }
];
const testOptions = { runCount: 1, jumpsPerRun: 1, wildcard: false, minAnswersForConstraint: 2, constraintChance: 1 };

function onePool(id, pool) {
  return [{ id, rounds: [pool] }];
}
const allOf = engine.createRuns(onePool('all-of', {
  subject: 'artifact', domain: 'Test', prompt: 'fallback', answers: metadataAnswers,
  constraintVariants: [{ label: 'Italian artifacts before 250', subject: 'artifact', allOf: [
    { type: 'temporal', direction: 'before', year: 250 }, { type: 'origin', origin: 'Italy' }
  ] }]
}), testOptions)[0].rounds[0];
assert.equal(allOf.constraintType, 'combined');
assert.equal(allOf.answers.length, 3);
assert.match(allOf.prompt, /and/);

const anyOf = engine.createRuns(onePool('any-of', {
  domain: 'Test', prompt: 'fallback', answers: metadataAnswers,
  constraintVariants: [{ subject: 'artifact', anyOf: [
    { type: 'origin', origin: 'Italy' }, { type: 'associative', person: 'X' }
  ] }]
}), testOptions)[0].rounds[0];
assert.equal(anyOf.constraintType, 'combined');
assert.equal(anyOf.answers.length, 4);
assert.match(anyOf.prompt, /or/);

const temporal = engine.createRuns(onePool('temporal', {
  domain: 'Test', subject: 'artifact', prompt: 'fallback', answers: metadataAnswers,
  constraintVariants: [{ type: 'temporal', direction: 'after', year: 200, prompt: 'Name an artifact dated after 200.' }]
}), testOptions)[0].rounds[0];
assert.deepEqual(temporal.answers.map(answer => answer.name), ['C', 'D']);

const composerPool = pools.find(pool => pool.id === 'classical-composers-born-before-1900');
assert.ok(composerPool.answers.every(answer => answer.metadata?.origin), 'composer origins should be explicitly tagged');
const germanComposerRule = composerPool.constraintVariants.find(variant => variant.type === 'origin' && variant.origin === 'Germany');
const germanComposers = engine.createRuns(onePool('german-composers', { ...composerPool, constraintVariants: [germanComposerRule] }), testOptions)[0].rounds[0];
assert.equal(germanComposers.answers.length, 3);
assert.ok(germanComposers.answers.every(answer => answer.metadata.origin === 'Germany'));

const gamesPool = pools.find(pool => pool.id === 'tabletop-games-first-attested-before-2000');
const miltonRule = gamesPool.constraintVariants.find(variant => variant.type === 'associative');
const miltonGames = engine.createRuns(onePool('milton-games', { ...gamesPool, constraintVariants: [miltonRule] }), testOptions)[0].rounds[0];
assert.equal(miltonGames.answers.length, 3);
assert.ok(miltonGames.answers.every(answer => answer.metadata.associations.includes('Milton Bradley')));
const usOrMiltonRule = gamesPool.constraintVariants.find(variant => Array.isArray(variant.anyOf));
const usOrMiltonGames = engine.createRuns(onePool('us-or-milton-games', { ...gamesPool, constraintVariants: [usOrMiltonRule] }), testOptions)[0].rounds[0];
assert.equal(usOrMiltonGames.answers.length, 6);

const matchingAnswers = [
  { name: 'Beyoncé', aliases: ['Queen B'] },
  { name: 'Beyonce Knowles', aliases: [] },
  { name: 'The Beatles', aliases: ['Beatles'] }
];
assert.equal(engine.matchAnswer('queen b', matchingAnswers).name, 'Beyoncé');
assert.equal(engine.matchAnswer('Beyonce', matchingAnswers).name, 'Beyoncé');
assert.equal(engine.matchAnswer('Beatle', matchingAnswers).name, 'The Beatles');
assert.equal(engine.matchAnswer('Beatles', matchingAnswers).name, 'The Beatles');
assert.equal(engine.matchAnswer('Bater', [{ name: 'Cater' }, { name: 'Later' }]), null, 'ambiguous fuzzy matches must be rejected');
assert.equal(engine.matchAnswer('', matchingAnswers), null);

assert.equal(engine.calculateFuel({ points: 80 }, { rarityMode: 'balanced' }), 80);
assert.equal(engine.calculateFuel({ points: 80 }, { rarityMode: 'balanced', modifier: { type: 'inverse-rarity' } }), 35);
assert.equal(engine.calculateFuel({ points: 80 }, { rarityMode: 'mainstream' }), 61);
const doubleRun = { rounds: [
  { answers: [{ points: 20, tier: 'Common' }], rarityMode: 'balanced' },
  { answers: [{ points: 30, tier: 'Rare' }], rarityMode: 'balanced', modifier: { type: 'double-or-nothing' } }
] };
assert.equal(engine.getRunMaxFuel(doubleRun), 70, 'Double or Nothing doubles the previously banked maximum once');
assert.equal(engine.getRunMaxFuel({ rounds: [{ answers: [{ points: 25 }], rarityMode: 'balanced', modifier: { type: 'double-or-nothing' } }] }), 25, 'a first-round Double or Nothing has no prior bank to double');
assert.equal(engine.getRunMaxFuel({ rounds: [{ answers: [{ points: 25 }], rarityMode: 'balanced' }, { answers: [{ points: 30 }], rarityMode: 'balanced' }] }), 55, 'ordinary rounds add their individual ceilings');

const deterministicA = engine.createRuns(archive, { runCount: 1, jumpsPerRun: 7, seed: 123, wildcard: true, constraintChance: 1 });
const deterministicB = engine.createRuns(archive, { runCount: 1, jumpsPerRun: 7, seed: 123, wildcard: true, constraintChance: 1 });
assert.equal(JSON.stringify(deterministicA), JSON.stringify(deterministicB), 'same seed should produce identical expeditions');

const invalid = engine.createRuns([{ id: 'bad', rounds: [{ prompt: 'bad', domain: 'Test', answers: [
  { name: 'same', aliases: ['duplicate'], points: -1, tier: 'Legendary' },
  { name: 'same', aliases: ['duplicate'], points: 5, tier: 'Common' }
] }] }], { runCount: 1, jumpsPerRun: 1, wildcard: false });
assert.ok(invalid[0].diagnostics.length >= 3, 'invalid pool content should produce diagnostics');
assert.equal(invalid[0].rounds.length, 0, 'invalid pools must not enter a generated expedition');

console.log('Question Engine tests passed.');


// Answer Recognition Engine: a large external archive can expand a question's
// accepted answers, but only when explicit semantic criteria are satisfied.
const answerRecognition = context.window.AnswerRecognition;
const composerQuestion = engine.createRuns(onePool('composer-kb', {
  ...composerPool,
  constraintVariants: []
}), { ...testOptions, constraintChance: 0 })[0].rounds[0];
answerRecognition.setDatabase({ version: 'test', entities: [
  { wikidataId: 'QTEST1', label: 'Clara Schumann', aliases: ['Clara Wieck'], classes: ['Q36834'],
    facts: { dateYear: 1819, birthYear: 1819 }, tier: 'Uncommon', points: 48, source: 'Wikidata' },
  { wikidataId: 'QTEST2', label: 'A Random Physicist', aliases: [], classes: ['Q169470'],
    facts: { dateYear: 1900 }, tier: 'Uncommon', points: 48, source: 'Wikidata' }
] });
const externalMatch = answerRecognition.match('Clara Wieck', composerQuestion);
assert.equal(externalMatch?.name, 'Clara Schumann', 'a verified alias in the external KB should be accepted');
assert.equal(externalMatch?.knowledgeBaseMatch, true);
assert.equal(answerRecognition.match('A Random Physicist', composerQuestion), null,
  'an entity outside the question category must not be accepted');
assert.equal(answerRecognition.match('Clara Schuman', composerQuestion)?.name, 'Clara Schumann',
  'a unique minor typo should resolve to the canonical entity');

const temporalComposerQuestion = { ...composerQuestion, activeConstraint: {
  type: 'temporal', direction: 'before', year: 1800
} };
assert.equal(answerRecognition.match('Clara Schumann', temporalComposerQuestion), null,
  'external candidates must satisfy the active temporal constraint too');

const boardGameQuestion = engine.createRuns(onePool('board-game-kb', {
  ...gamesPool,
  constraintVariants: [gamesPool.constraintVariants.find(variant => variant.type === 'associative')]
}), { ...testOptions, constraintChance: 1 })[0].rounds[0];
answerRecognition.setDatabase({ version: 'relation-test', entities: [
  { wikidataId: 'QTEST5', label: 'Example Milton Bradley Game', aliases: [], classes: ['Q131436'],
    facts: { dateYear: 1985, countryNames: ['United States of America'], associationNames: ['Milton Bradley Company'] },
    tier: 'Uncommon', points: 48 }
] });
assert.equal(answerRecognition.match('Example Milton Bradley Game', boardGameQuestion)?.name,
  'Example Milton Bradley Game', 'publisher associations should be checked for associative constraints');

answerRecognition.setDatabase({ version: 'ambiguous-test', entities: [
  { wikidataId: 'QTEST3', label: 'Alex Smith', aliases: ['Alex'], classes: ['Q36834'], facts: { dateYear: 1800 }, tier: 'Uncommon' },
  { wikidataId: 'QTEST4', label: 'Alex Jones', aliases: ['Alex'], classes: ['Q36834'], facts: { dateYear: 1801 }, tier: 'Uncommon' }
] });
assert.equal(answerRecognition.match('Alex', composerQuestion), null,
  'ambiguous aliases must never be guessed');

/* Chrononaut application controller. Vanilla JS: no framework/runtime version pinning. */
(function () {
  'use strict';
    const answerKnowledgeReady = window.AnswerRecognition
      ? window.AnswerRecognition.load('answer-knowledge-base.json')
      : Promise.resolve(false);

    const GAME_EXPEDITIONS = QuestionEngine.createRuns(ChrononautContent.seeds, {
      runCount: ChrononautContent.seeds.length,
      jumpsPerRun: 7,
      domainMixing: true,
      rarity: 'balanced',
      wildcard: true
    });

    const BASE_YEAR = 2026;
    const ROUND_DURATION = 25.0;
    let currentSeedIndex = 0;
    function getMaxPossibleFuel() {
      return GAME_EXPEDITIONS[currentSeedIndex]?.maxFuel || 0;
    }
    let gameState = {
      phase: 'start', // 'start' | 'playing' | 'feedback' | 'summary'
      roundIndex: 0,
      fuelTotal: 0,
      displayFuel: 0,
      currentYear: BASE_YEAR,
      targetYear: BASE_YEAR,
      timeLeft: ROUND_DURATION,
      timerInterval: null,
      freezeUsed: false,
      isFrozen: false,
      freezeTimeout: null,
      attempts: 0,
      history: []
    };

    // Canvas mechanical animation state
    let railState = {
      capsuleProgress: 0,        // 0 to 1 across the current expedition's computed fuel ceiling
      targetCapsuleProgress: 0,
      wheelAngle: 0,
      burnBoost: 0,              // spikes while burning newly distilled fuel
      tankChargeRatio: 0,        // visual liquid level inside the canvas capsule tank
      steamPuffs: [],
      sparks: []
    };

    /**
     * ============================================================================
     * DOM REFERENCES
     * ============================================================================
     */
    const el = {
      modeBadge: document.getElementById('mode-badge'),
      switchSeedTopBtn: document.getElementById('switch-seed-top-btn'),
      fuelConversionReadout: document.getElementById('fuel-conversion-readout'),
      fuelTankBar: document.getElementById('fuel-tank-bar'),
      totalFuelDisplay: document.getElementById('total-fuel-display'),
      yearCounterDisplay: document.getElementById('year-counter-display'),
      jumpProgressBar: document.getElementById('jump-progress-bar'),
      canvas: document.getElementById('chronosphere-canvas'),

      startScreen: document.getElementById('start-screen'),
      gameScreen: document.getElementById('game-screen'),
      summaryScreen: document.getElementById('summary-screen'),

      startGameBtn: document.getElementById('start-game-btn'),
      roundNumberBadge: document.getElementById('round-number-badge'),
      eraTag: document.getElementById('era-tag'),
      chronoFreezeBtn: document.getElementById('chrono-freeze-btn'),
      freezeBtnLabel: document.getElementById('freeze-btn-label'),
      timerBox: document.getElementById('timer-box'),
      timerIcon: document.getElementById('timer-icon'),
      timerDisplay: document.getElementById('timer-display'),

      promptText: document.getElementById('prompt-text'),
      promptHint: document.getElementById('prompt-hint'),

      inputPhase: document.getElementById('input-phase'),
      guessForm: document.getElementById('guess-form'),
      guessInput: document.getElementById('guess-input'),
      inputFeedbackMsg: document.getElementById('input-feedback-msg'),
      attemptsCounter: document.getElementById('attempts-counter'),
      skipRoundBtn: document.getElementById('skip-round-btn'),

      resultPhase: document.getElementById('result-phase'),
      resultTierBadge: document.getElementById('result-tier-badge'),
      resultYearTag: document.getElementById('result-year-tag'),
      resultAnswerTitle: document.getElementById('result-answer-title'),
      resultPointsGained: document.getElementById('result-points-gained'),
      resultYearShift: document.getElementById('result-year-shift'),
      resultFactText: document.getElementById('result-fact-text'),
      resultParadoxExample: document.getElementById('result-paradox-example'),
      resultPoolCount: document.getElementById('result-pool-count'),
      nextRoundBtn: document.getElementById('next-round-btn'),

      finalRankTitle: document.getElementById('final-rank-title'),
      finalRankSubtitle: document.getElementById('final-rank-subtitle'),
      summaryFinalYear: document.getElementById('summary-final-year'),
      summaryTotalScore: document.getElementById('summary-total-score'),
      summaryBreakdownList: document.getElementById('summary-breakdown-list'),
      copyChronologBtn: document.getElementById('copy-chronolog-btn'),
      playPracticeBtn: document.getElementById('play-practice-btn'),

      howToBtn: document.getElementById('how-to-btn'),
      howToModal: document.getElementById('how-to-modal'),
      closeModalBtn: document.getElementById('close-modal-btn'),
      gotItBtn: document.getElementById('got-it-btn'),
      toastBanner: document.getElementById('toast-banner')
    };

    /**
     * ============================================================================
     * FUZZY STRING MATCHING & ALIAS RESOLUTION
     * ============================================================================
     */
    function findMatchingAnswer(rawInput, roundData) {
      if (window.AnswerRecognition) return window.AnswerRecognition.match(rawInput, roundData);
      return QuestionEngine.matchAnswer(rawInput, roundData.answers);
    }

    /**
     * ============================================================================
     * VISUAL THEME & TIER STYLING HELPERS
     * ============================================================================
     */
    function applyEraTheme(theme = {}) {
      document.documentElement.style.setProperty('--era-accent', theme.accent || '#B85A2A');
      document.documentElement.style.setProperty('--era-tint', theme.skyTop || '#F3E5D0');
    }

    function getTierStyling(tier) {
      switch (tier) {
        case 'Paradox':
          return {
            badgeClass: 'bg-plum text-paper border-ink',
            pillColor: 'bg-plum',
            emoji: '🟣'
          };
        case 'Rare':
          return {
            badgeClass: 'bg-prussian text-paper border-ink',
            pillColor: 'bg-prussian',
            emoji: '🔵'
          };
        case 'Uncommon':
          return {
            badgeClass: 'bg-verdigris text-paper border-ink',
            pillColor: 'bg-verdigris',
            emoji: '🟢'
          };
        case 'Common':
          return {
            badgeClass: 'bg-brass text-ink border-ink',
            pillColor: 'bg-brass',
            emoji: '🟡'
          };
        default:
          return {
            badgeClass: 'bg-vermilion text-paper border-ink',
            pillColor: 'bg-vermilion',
            emoji: '⬛'
          };
      }
    }

    function renderProgressPills() {
      const rounds = GAME_EXPEDITIONS[currentSeedIndex].rounds;
      el.jumpProgressBar.innerHTML = '';

      rounds.forEach((r, idx) => {
        const record = gameState.history[idx];
        const isCurrent = (gameState.phase === 'playing' || gameState.phase === 'feedback') && gameState.roundIndex === idx && !record;
        const pill = document.createElement('div');

        let barColor = 'bg-paperDark border border-ink/30';
        let labelColor = 'text-inkMuted';

        if (record) {
          barColor = `${getTierStyling(record.tier).pillColor} border border-ink`;
          labelColor = 'text-ink font-bold';
        } else if (isCurrent) {
          barColor = 'bg-ink border border-ink';
          labelColor = 'text-ink font-extrabold';
        }

        pill.className = 'flex flex-col gap-1';
        pill.innerHTML = `
          <div class="h-2 w-full rounded-sm ${barColor} transition-all duration-300"></div>
          <span class="text-[10px] font-mono truncate ${labelColor}">${idx + 1}. ${r.era.split(' ')[0]}</span>
        `;
        el.jumpProgressBar.appendChild(pill);
      });
    }

    function updateFuelSightGlass(fuelAmount, isBurning = false) {
      const pct = Math.min(100, Math.max(0, (fuelAmount / getMaxPossibleFuel()) * 100));
      el.fuelTankBar.style.width = `${pct}%`;
      if (isBurning) {
        el.fuelTankBar.classList.add('burning');
        setTimeout(() => el.fuelTankBar.classList.remove('burning'), 900);
      }
    }

    function showToast(message) {
      el.toastBanner.textContent = message;
      el.toastBanner.classList.remove('opacity-0');
      el.toastBanner.classList.add('opacity-100');
      setTimeout(() => {
        el.toastBanner.classList.remove('opacity-100');
        el.toastBanner.classList.add('opacity-0');
      }, 2400);
    }

    /**
     * ============================================================================
     * GAMEPLAY FLOW CONTROLLERS
     * ============================================================================
     */
    function initGame(seedIdx = 0) {
      currentSeedIndex = seedIdx;
      const seed = GAME_EXPEDITIONS[currentSeedIndex];

      clearInterval(gameState.timerInterval);
      clearTimeout(gameState.freezeTimeout);

      gameState = {
        phase: 'start',
        roundIndex: 0,
        fuelTotal: 0,
        displayFuel: 0,
        currentYear: BASE_YEAR,
        targetYear: BASE_YEAR,
        timeLeft: ROUND_DURATION,
        timerInterval: null,
        freezeUsed: false,
        isFrozen: false,
        freezeTimeout: null,
        attempts: 0,
        history: []
      };

      railState.capsuleProgress = 0;
      railState.targetCapsuleProgress = 0;
      railState.burnBoost = 0;
      railState.tankChargeRatio = 0;
      railState.steamPuffs = [];
      railState.sparks = [];

      el.modeBadge.textContent = seed.id;
      const nextSeedIndex = (currentSeedIndex + 1) % GAME_EXPEDITIONS.length;
      el.switchSeedTopBtn.textContent = `Switch to ${GAME_EXPEDITIONS[nextSeedIndex].id}`;
      el.fuelConversionReadout.textContent = '1 PT = +1 YR FUEL';
      el.totalFuelDisplay.textContent = `0 / ${getMaxPossibleFuel()}`;
      el.yearCounterDisplay.textContent = `${BASE_YEAR} AD`;
      updateFuelSightGlass(0, false);

      applyEraTheme(seed.rounds[0].theme);
      renderProgressPills();

      el.startScreen.classList.remove('hidden');
      el.gameScreen.classList.add('hidden');
      el.summaryScreen.classList.add('hidden');
    }

    function startRound(idx) {
      const seed = GAME_EXPEDITIONS[currentSeedIndex];
      const roundData = seed.rounds[idx];

      gameState.phase = 'playing';
      gameState.roundIndex = idx;
      gameState.timeLeft = roundData.duration || ROUND_DURATION;
      gameState.isFrozen = false;
      gameState.attempts = 0;

      applyEraTheme(roundData.theme);
      renderProgressPills();

      el.startScreen.classList.add('hidden');
      el.summaryScreen.classList.add('hidden');
      el.gameScreen.classList.remove('hidden');

      el.inputPhase.classList.remove('hidden');
      el.resultPhase.classList.add('hidden');

      el.roundNumberBadge.textContent = `JUMP ${idx + 1} / ${seed.rounds.length}`;
      el.eraTag.textContent = `${roundData.era} • ${roundData.constraint}`;
      el.promptText.textContent = roundData.prompt;
      el.promptHint.textContent = roundData.modifier ? `${roundData.hint} • WILDCARD: ${roundData.modifier.label}` : roundData.hint;
      el.attemptsCounter.textContent = 'Attempts: 0 • Minor typos accepted';
      el.fuelConversionReadout.textContent = '1 PT = +1 YR FUEL';

      el.guessInput.value = '';
      el.inputFeedbackMsg.classList.add('hidden');
      setTimeout(() => el.guessInput.focus(), 50);

      if (gameState.freezeUsed) {
        el.chronoFreezeBtn.disabled = true;
        el.freezeBtnLabel.textContent = 'Switch Expended';
      } else {
        el.chronoFreezeBtn.disabled = false;
        el.freezeBtnLabel.textContent = 'Freeze Clock (-15y)';
      }

      startRoundTimer();
    }

    function startRoundTimer() {
      clearInterval(gameState.timerInterval);
      updateTimerUI();

      gameState.timerInterval = setInterval(() => {
        if (gameState.phase !== 'playing' || gameState.isFrozen) return;

        gameState.timeLeft = Math.max(0, gameState.timeLeft - 0.1);
        updateTimerUI();

        if (gameState.timeLeft <= 0) {
          clearInterval(gameState.timerInterval);
          completeRound(null, 'Clock Expired');
        }
      }, 100);
    }

    function updateTimerUI() {
      el.timerDisplay.textContent = `${gameState.timeLeft.toFixed(1)}s`;

      if (gameState.isFrozen) {
        el.timerBox.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-prussian text-paper border-2 border-ink font-mono font-bold text-sm min-w-[78px] justify-center';
        el.timerIcon.className = 'w-2 h-2 rounded-full bg-paper';
      } else if (gameState.timeLeft <= 6.0) {
        el.timerBox.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vermilion text-paper border-2 border-ink font-mono font-bold text-sm min-w-[78px] justify-center animate-pulse';
        el.timerIcon.className = 'w-2 h-2 rounded-full bg-paper';
      } else {
        el.timerBox.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper border-2 border-ink font-mono font-bold text-sm text-ink min-w-[78px] justify-center';
        el.timerIcon.className = 'w-2 h-2 rounded-full bg-verdigris';
      }
    }

    function activateChronoFreeze() {
      if (gameState.freezeUsed || gameState.phase !== 'playing') return;

      gameState.freezeUsed = true;
      gameState.isFrozen = true;

      // Deduct 15 years of fuel (clamped at 0)
      const penalty = Math.min(15, gameState.fuelTotal);
      gameState.fuelTotal -= penalty;
      gameState.targetYear = BASE_YEAR + gameState.fuelTotal;
      railState.targetCapsuleProgress = Math.min(1, gameState.fuelTotal / getMaxPossibleFuel());
      updateFuelSightGlass(gameState.fuelTotal, false);

      el.chronoFreezeBtn.disabled = true;
      el.freezeBtnLabel.textContent = 'Frozen (10s)';
      el.fuelConversionReadout.textContent = `ESCAPEMENT LOCKED (-${penalty}y FUEL)`;
      updateTimerUI();
      showToast(`Escapement locked for 10s (-${penalty} yrs fuel)`);

      gameState.freezeTimeout = setTimeout(() => {
        gameState.isFrozen = false;
        el.freezeBtnLabel.textContent = 'Switch Expended';
        el.fuelConversionReadout.textContent = '1 PT = +1 YR FUEL';
        updateTimerUI();
      }, 10000);
    }

    function handleGuessSubmit(e) {
      e.preventDefault();
      if (gameState.phase !== 'playing') return;

      const raw = el.guessInput.value.trim();
      if (!raw) return;

      const roundData = GAME_EXPEDITIONS[currentSeedIndex].rounds[gameState.roundIndex];
      const match = findMatchingAnswer(raw, roundData);

      if (match) {
        clearInterval(gameState.timerInterval);
        clearTimeout(gameState.freezeTimeout);
        gameState.isFrozen = false;
        completeRound(match, 'Matched');
      } else {
        gameState.attempts += 1;
        el.attemptsCounter.textContent = `Attempts: ${gameState.attempts} • Minor typos accepted`;
        el.inputFeedbackMsg.classList.remove('hidden');

        el.guessInput.classList.remove('animate-shake');
        void el.guessInput.offsetWidth;
        el.guessInput.classList.add('animate-shake');
        el.guessInput.select();
      }
    }

    function completeRound(matchedEntry, statusReason) {
      gameState.phase = 'feedback';
      const seed = GAME_EXPEDITIONS[currentSeedIndex];
      const roundData = seed.rounds[gameState.roundIndex];

      const bestAnswer = roundData.answers.reduce((best, answer) => {
        if (!best) return answer;
        return QuestionEngine.calculateFuel(answer, roundData) > QuestionEngine.calculateFuel(best, roundData) ? answer : best;
      }, null);
      const bestFuel = QuestionEngine.calculateFuel(bestAnswer, roundData);
      const modifier = roundData.modifier;
      const previousFuel = gameState.fuelTotal;
      const previousYear = gameState.targetYear;
      const answerFuel = QuestionEngine.calculateFuel(matchedEntry, roundData);
      let fuelGained = answerFuel;
      let fuelLost = 0;
      if (modifier?.type === 'double-or-nothing') {
        if (matchedEntry) fuelGained = previousFuel + answerFuel;
        else {
          fuelLost = previousFuel;
          gameState.fuelTotal = 0;
          fuelGained = 0;
        }
      }
      const tier = matchedEntry ? matchedEntry.tier : 'Empty';

      gameState.fuelTotal = Math.max(0, gameState.fuelTotal + fuelGained);
      gameState.targetYear = BASE_YEAR + gameState.fuelTotal;
      railState.targetCapsuleProgress = Math.min(1, gameState.fuelTotal / getMaxPossibleFuel());

      // Update sight-glass & trigger mechanical boiler burn animation
      updateFuelSightGlass(gameState.fuelTotal, fuelGained > 0);
      if (fuelGained > 0) {
        el.fuelConversionReadout.textContent = modifier?.type === 'double-or-nothing'
          ? `DOUBLE OR NOTHING: +${fuelGained} YRS FUEL!`
          : `BURNING +${fuelGained} PTS → +${fuelGained} YRS FUEL!`;
        triggerBoilerBurn(fuelGained / 100);
      } else if (fuelLost > 0) {
        el.fuelConversionReadout.textContent = `DOUBLE OR NOTHING: -${fuelLost} YRS FUEL!`;
      } else {
        el.fuelConversionReadout.textContent = '0 PTS → 0 YRS FUEL (COASTING)';
      }

      gameState.history.push({
        era: roundData.era,
        prompt: roundData.prompt,
        userAnswer: matchedEntry ? matchedEntry.name : `(${statusReason})`,
        tier,
        fuelGained,
        answerFuel,
        fuelLost,
        bestAnswer,
        bestFuel
      });

      renderProgressPills();

      el.inputPhase.classList.add('hidden');
      el.resultPhase.classList.remove('hidden');

      const tierStyle = getTierStyling(tier);
      el.resultTierBadge.className = `px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider border ${tierStyle.badgeClass}`;

      if (matchedEntry) {
        el.resultTierBadge.textContent = `${tier.toUpperCase()} FUEL`;
        el.resultYearTag.textContent = matchedEntry.year;
        el.resultAnswerTitle.textContent = matchedEntry.name;
        el.resultPointsGained.textContent = modifier?.type === 'double-or-nothing'
          ? `BANK DOUBLED → +${fuelGained} YRS`
          : `+${fuelGained} PTS → +${fuelGained} YRS`;
        el.resultPointsGained.className = 'font-mono font-extrabold text-base sm:text-lg text-verdigris';
        el.resultYearShift.textContent = `${previousYear} AD → ${gameState.targetYear} AD`;
        el.resultFactText.textContent = `${matchedEntry.fact}${modifier ? ` Wildcard: ${modifier.description}` : ''}`;
      } else {
        el.resultTierBadge.textContent = statusReason.toUpperCase();
        el.resultYearTag.textContent = 'No Fuel Distilled';
        el.resultAnswerTitle.textContent = 'Boiler Stalled — No Valid Entry';
        el.resultPointsGained.textContent = '+0 PTS → +0 YRS';
        el.resultPointsGained.className = 'font-mono font-extrabold text-base sm:text-lg text-vermilion';
        el.resultYearShift.textContent = modifier?.type === 'double-or-nothing'
          ? `${previousYear} AD → ${gameState.targetYear} AD (fuel forfeited)`
          : `Held at ${previousYear} AD`;
        el.resultFactText.textContent = `The highest-fuel valid entry was "${bestAnswer.name}" (+${bestFuel} fuel).${modifier?.type === 'double-or-nothing' ? ` Double or Nothing failed: ${fuelLost} accumulated fuel was forfeited.` : ''}`;
      }

      el.resultParadoxExample.textContent = `${bestAnswer.name} (+${bestFuel} fuel)`;
      el.resultPoolCount.textContent = `${roundData.answers.length} valid entries in archive`;

      const isLastRound = gameState.roundIndex >= seed.rounds.length - 1;
      el.nextRoundBtn.textContent = isLastRound
        ? 'Print Final Dispatch →'
        : `Proceed to Jump ${gameState.roundIndex + 2} →`;
      setTimeout(() => el.nextRoundBtn.focus(), 60);
    }

    function advanceFromFeedback() {
      const seed = GAME_EXPEDITIONS[currentSeedIndex];
      if (gameState.roundIndex < seed.rounds.length - 1) {
        startRound(gameState.roundIndex + 1);
      } else {
        showSummaryScreen();
      }
    }

    function showSummaryScreen() {
      gameState.phase = 'summary';
      const seed = GAME_EXPEDITIONS[currentSeedIndex];

      el.gameScreen.classList.add('hidden');
      el.summaryScreen.classList.remove('hidden');

      let rankTitle = 'Chronal Apprentice';
      let rankSub = 'Your capsule cleared the 21st century. Hunt deeper archival picks next run!';
      const fuelRatio = gameState.fuelTotal / getMaxPossibleFuel();
      if (fuelRatio >= 0.77) {
        rankTitle = 'Grand Master of the Continuum';
        rankSub = 'Extraordinary archival recall! Your Chronosphere propelled centuries ahead.';
      } else if (fuelRatio >= 0.586) {
        rankTitle = 'Chief Chrononaut Navigator';
        rankSub = 'High-grade fuel across multiple eras carried your capsule far into the future.';
      } else if (fuelRatio >= 0.4) {
        rankTitle = 'Meridian Pilot';
        rankSub = 'Steady fuel distillation across 7 jumps with strong era instincts.';
      }

      el.finalRankTitle.textContent = rankTitle;
      el.finalRankSubtitle.textContent = rankSub;
      el.summaryFinalYear.textContent = `${gameState.targetYear} AD`;
      el.summaryTotalScore.textContent = `+${gameState.fuelTotal} / ${getMaxPossibleFuel()}y`;

      el.summaryBreakdownList.innerHTML = '';
      gameState.history.forEach((item, i) => {
        const style = getTierStyling(item.tier);
        const row = document.createElement('div');
        row.className = 'p-3 rounded-xl bg-paper border-[1.5px] border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-2';
        row.innerHTML = `
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[11px] font-mono font-bold text-inkMuted">0${i + 1}</span>
              <span class="text-xs font-mono font-bold text-ink">${item.era}</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase border ${style.badgeClass}">${item.tier}</span>
            </div>
            <div class="font-serif font-bold text-sm sm:text-base text-ink truncate">
              ${item.userAnswer}
            </div>
          </div>
          <div class="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 border-t sm:border-t-0 border-ink/15 pt-1.5 sm:pt-0">
            <span class="font-mono font-bold text-xs sm:text-sm text-verdigris">${item.fuelLost ? `−${item.fuelLost} yrs forfeited` : `+${item.fuelGained} yrs fuel`}</span>
            <span class="text-[11px] text-plum font-mono font-semibold">Max: ${item.bestAnswer.name} (+${item.bestFuel}y)</span>
          </div>
        `;
        el.summaryBreakdownList.appendChild(row);
      });
    }

    function copyChronoLog() {
      const seed = GAME_EXPEDITIONS[currentSeedIndex];
      const emojiBar = gameState.history.map(h => getTierStyling(h.tier).emoji).join('');
      const lines = [
        `⏱️ CHRONONAUT — ${seed.id}`,
        `🚂 2026 AD → ${gameState.targetYear} AD (+${gameState.fuelTotal}/${getMaxPossibleFuel()} yrs fuel)`,
        `${emojiBar}`,
        ...gameState.history.map((h, i) => `${getTierStyling(h.tier).emoji} J${i + 1} ${h.era}: +${h.fuelGained}y${h.fuelLost ? ` (forfeited ${h.fuelLost}y)` : ''}`)
      ];

      const shareText = lines.join('\n');
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Dispatch card copied to clipboard!');
      } catch (err) {
        showToast('Could not copy automatically.');
      }
      document.body.removeChild(textArea);
    }

    /**
     * ============================================================================
     * BESPOKE EDITORIAL ILLUSTRATED CANVAS:
     * Vintage Brass Chronosphere Capsule on an Engraved Meridian Rail
     * - Parallax botanical/architectural hill silhouettes
     * - Engraved brass rail with year mileposts (dynamic expedition ceiling)
     * - Detailed brass-and-glass Chronosphere vehicle with rotating escapement gears,
     *   visible amber fuel sight-vial that fills & burns, and crisp comic steam puffs
     * ============================================================================
     */
    function triggerBoilerBurn(intensity) {
      railState.burnBoost = Math.min(1.4, railState.burnBoost + 0.55 + intensity * 0.85);
      railState.tankChargeRatio = 1.0;

      const wrapper = el.canvas.parentElement;
      const w = wrapper.clientWidth || 600;
      const h = wrapper.clientHeight || 120;
      const capX = 56 + railState.capsuleProgress * (w - 116);
      const railY = h - 26;

      // Spawn crisp hand-drawn steam puffs from the brass smokestack
      const puffCount = Math.floor(7 + intensity * 9);
      for (let i = 0; i < puffCount; i++) {
        railState.steamPuffs.push({
          x: capX - 10 + (Math.random() - 0.5) * 8,
          y: railY - 46,
          vx: -1.2 - Math.random() * 2.2,
          vy: -0.6 - Math.random() * 1.1,
          radius: 4 + Math.random() * 5,
          life: 1.0,
          decay: 0.016 + Math.random() * 0.012
        });
      }

      // Spawn warm brass combustion sparks from rear thruster valve
      const sparkCount = Math.floor(8 + intensity * 12);
      for (let i = 0; i < sparkCount; i++) {
        railState.sparks.push({
          x: capX - 28,
          y: railY - 14,
          vx: -2.5 - Math.random() * 3.5,
          vy: (Math.random() - 0.5) * 2.4,
          life: 1.0,
          decay: 0.03 + Math.random() * 0.02,
          color: i % 2 === 0 ? '#C87D28' : '#2E6F5E'
        });
      }
    }

    function resizeChronosphereCanvas() {
      const wrapper = el.canvas.parentElement;
      if (!wrapper) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = wrapper.getBoundingClientRect();
      el.canvas.width = rect.width * dpr;
      el.canvas.height = rect.height * dpr;
      const ctx = el.canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawEngravedGear(ctx, cx, cy, outerR, teeth, angle, fill, stroke) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.4;

      ctx.beginPath();
      const innerR = outerR * 0.72;
      const step = (Math.PI * 2) / teeth;
      for (let i = 0; i < teeth; i++) {
        const a0 = i * step;
        const a1 = a0 + step * 0.25;
        const a2 = a0 + step * 0.55;
        const a3 = a0 + step * 0.8;
        ctx.lineTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
        ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
        ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Center axle pin
      ctx.fillStyle = stroke;
      ctx.beginPath();
      ctx.arc(0, 0, outerR * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawEraWatermark(ctx, w, h, symbol, accentColor) {
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 1.6;
      const cx = w - 64;
      const cy = 38;

      if (symbol === 'pillar') {
        // Classical column capital & flutes
        ctx.strokeRect(cx - 16, cy - 16, 32, 5);
        ctx.strokeRect(cx - 12, cy - 11, 24, 26);
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy - 11); ctx.lineTo(cx - 5, cy + 15);
        ctx.moveTo(cx + 5, cy - 11); ctx.lineTo(cx + 5, cy + 15);
        ctx.stroke();
      } else if (symbol === 'compass') {
        // Drafting compass / astrolabe circle
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.moveTo(cx, cy - 22); ctx.lineTo(cx, cy + 22);
        ctx.moveTo(cx - 22, cy); ctx.lineTo(cx + 22, cy);
        ctx.stroke();
      } else if (symbol === 'vinyl') {
        // Grooved LP record
        ctx.beginPath();
        ctx.arc(cx, cy, 19, 0, Math.PI * 2);
        ctx.moveTo(cx + 13, cy);
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.moveTo(cx + 5, cy);
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (symbol === 'cartridge') {
        // Classic game cartridge silhouette
        ctx.strokeRect(cx - 15, cy - 17, 30, 34);
        ctx.strokeRect(cx - 10, cy - 12, 20, 14);
      } else if (symbol === 'globe') {
        // Latitude/longitude meridian sphere
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.ellipse(cx, cy, 9, 18, 0, 0, Math.PI * 2);
        ctx.moveTo(cx - 18, cy); ctx.lineTo(cx + 18, cy);
        ctx.stroke();
      } else if (symbol === 'reel') {
        // Cinema film reel
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();
        for (let a = 0; a < 4; a++) {
          const ang = (a * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * 9, cy + Math.sin(ang) * 9, 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // Gear emblem
        drawEngravedGear(ctx, cx, cy, 18, 8, 0.2, 'transparent', accentColor);
      }
      ctx.restore();
    }

    function animateChronosphere() {
      const wrapper = el.canvas.parentElement;
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      const ctx = el.canvas.getContext('2d');

      const seed = GAME_EXPEDITIONS[currentSeedIndex];
      const currentRound = seed.rounds[gameState.roundIndex] || seed.rounds[0];
      const theme = currentRound.theme;

      // Interpolate odometer year & fuel readout
      if (Math.abs(gameState.targetYear - gameState.currentYear) > 0.35) {
        gameState.currentYear += (gameState.targetYear - gameState.currentYear) * 0.11;
        el.yearCounterDisplay.textContent = `${Math.round(gameState.currentYear)} AD`;
      } else if (gameState.currentYear !== gameState.targetYear) {
        gameState.currentYear = gameState.targetYear;
        el.yearCounterDisplay.textContent = `${gameState.currentYear} AD`;
      }

      if (Math.abs(gameState.fuelTotal - gameState.displayFuel) > 0.35) {
        gameState.displayFuel += (gameState.fuelTotal - gameState.displayFuel) * 0.14;
        el.totalFuelDisplay.textContent = `${Math.round(gameState.displayFuel)} / ${getMaxPossibleFuel()}`;
      } else if (gameState.displayFuel !== gameState.fuelTotal) {
        gameState.displayFuel = gameState.fuelTotal;
        el.totalFuelDisplay.textContent = `${gameState.fuelTotal} / ${getMaxPossibleFuel()}`;
      }

      // Smoothly move capsule along meridian rail
      const prevProg = railState.capsuleProgress;
      railState.capsuleProgress += (railState.targetCapsuleProgress - railState.capsuleProgress) * 0.085;
      const deltaMove = Math.abs(railState.capsuleProgress - prevProg);

      railState.burnBoost *= 0.94;
      railState.tankChargeRatio = Math.max(0.18, railState.tankChargeRatio * 0.985);
      railState.wheelAngle += 0.02 + deltaMove * 42 + railState.burnBoost * 0.14;

      // 1. Archival Sky Wash
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, theme.skyTop);
      skyGrad.addColorStop(1, theme.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle latitude grid lines in sky
      ctx.strokeStyle = 'rgba(28, 27, 24, 0.06)';
      ctx.lineWidth = 1;
      for (let y = 20; y < h - 25; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Era engraved stamp watermark in top-right sky
      drawEraWatermark(ctx, w, h, theme.symbol, theme.accent);

      // 2. Parallax Rolling Ridge Silhouette (Shifts gently as capsule travels)
      const railY = h - 26;
      const parallaxShift = railState.capsuleProgress * 110;
      ctx.fillStyle = 'rgba(28, 27, 24, 0.07)';
      ctx.beginPath();
      ctx.moveTo(0, railY);
      for (let x = 0; x <= w + 20; x += 20) {
        const ridgeH = Math.sin((x + parallaxShift) * 0.015) * 10 + Math.cos((x + parallaxShift) * 0.032) * 5 + 18;
        ctx.lineTo(x, railY - ridgeH);
      }
      ctx.lineTo(w, railY);
      ctx.closePath();
      ctx.fill();

      // 3. Engraved Brass Meridian Track & Mileposts
      const padX = 56;
      const trackWidth = Math.max(60, w - padX * 2);
      const capX = padX + railState.capsuleProgress * trackWidth;

      // Wooden/ink railway sleepers beneath rail
      ctx.fillStyle = '#1C1B18';
      for (let sx = padX - 8; sx <= padX + trackWidth + 8; sx += 16) {
        ctx.fillRect(sx - 2, railY + 2, 4, 5);
      }

      // Main rail bed
      ctx.fillStyle = '#D5CCB6';
      ctx.fillRect(padX - 10, railY - 2, trackWidth + 20, 5);
      ctx.strokeStyle = '#1C1B18';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(padX - 10, railY - 2, trackWidth + 20, 5);

      // Burned fuel brass trail behind capsule
      if (capX > padX + 2) {
        ctx.fillStyle = theme.accent;
        ctx.fillRect(padX, railY - 1.5, capX - padX, 4);
      }

      // Dynamic year mileposts match the current expedition's actual fuel ceiling.
      const fuelCeiling = getMaxPossibleFuel();
      const mileposts = [0, 0.2, 0.4, 0.6, 0.8, 1].map(frac => ({
        year: String(Math.round(BASE_YEAR + fuelCeiling * frac)), frac
      }));

      ctx.font = '700 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';

      mileposts.forEach(mp => {
        const mx = padX + mp.frac * trackWidth;
        const passed = railState.capsuleProgress >= mp.frac - 0.015;

        // Brass milepost pin
        ctx.strokeStyle = '#1C1B18';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mx, railY - 2);
        ctx.lineTo(mx, railY + 9);
        ctx.stroke();

        ctx.fillStyle = passed ? '#1C1B18' : '#6E695D';
        ctx.fillText(mp.year, mx, railY + 20);
      });

      // 4. Steam Puffs & Combustion Sparks
      for (let i = railState.steamPuffs.length - 1; i >= 0; i--) {
        const p = railState.steamPuffs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.16;
        p.life -= p.decay;
        if (p.life <= 0) {
          railState.steamPuffs.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.life * 0.85;
        ctx.fillStyle = '#FAF7F0';
        ctx.strokeStyle = '#1C1B18';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      for (let i = railState.sparks.length - 1; i >= 0; i--) {
        const s = railState.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) {
          railState.sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
        ctx.restore();
      }

      // 5. Hand-Crafted Brass & Glass Chronosphere Vehicle
      const bobY = Math.sin(railState.wheelAngle * 2) * (0.4 + railState.burnBoost * 0.7);
      ctx.save();
      ctx.translate(capX, railY - 4 + bobY);

      // Rear Thruster Nozzle
      ctx.fillStyle = '#575349';
      ctx.strokeStyle = '#1C1B18';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-22, -14);
      ctx.lineTo(-30, -18);
      ctx.lineTo(-30, -6);
      ctx.lineTo(-22, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Boiler Burner Flame when fuel is actively burning
      if (railState.burnBoost > 0.08) {
        const flameLen = 10 + railState.burnBoost * 24 + Math.random() * 6;
        ctx.fillStyle = '#2E6F5E';
        ctx.beginPath();
        ctx.moveTo(-30, -16);
        ctx.lineTo(-30 - flameLen, -12);
        ctx.lineTo(-30, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Brass Smokestack / Chronal Vent
      ctx.fillStyle = '#C87D28';
      ctx.fillRect(-14, -40, 7, 12);
      ctx.strokeRect(-14, -40, 7, 12);
      ctx.fillStyle = '#1C1B18';
      ctx.fillRect(-16, -42, 11, 3);

      // Main Brushed-Brass Chassis Body
      ctx.fillStyle = '#D99B43';
      ctx.strokeStyle = '#1C1B18';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-24, -28, 48, 20, [6, 12, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Forward Glass Observation Dome (Cockpit)
      ctx.fillStyle = '#E6F0EC';
      ctx.beginPath();
      ctx.arc(15, -24, 10, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glass reflection glint
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(15, -24, 6.5, Math.PI * 1.15, Math.PI * 1.55);
      ctx.stroke();

      // On-Board Glass Fuel Vial (Visibly fills with amber/verdigris fuel!)
      ctx.fillStyle = '#FAF7F0';
      ctx.strokeStyle = '#1C1B18';
      ctx.lineWidth = 1.4;
      ctx.fillRect(-19, -24, 22, 9);
      ctx.strokeRect(-19, -24, 22, 9);

      const fuelFillW = Math.max(2, 20 * Math.min(1, (gameState.fuelTotal / getMaxPossibleFuel()) * 0.75 + railState.burnBoost * 0.4));
      ctx.fillStyle = railState.burnBoost > 0.15 ? '#2E6F5E' : '#C87D28';
      ctx.fillRect(-18, -23, Math.min(20, fuelFillW), 7);

      // Two Rotating Escapement Drive Wheels
      drawEngravedGear(ctx, -13, -5, 7.5, 8, railState.wheelAngle, '#FAF7F0', '#1C1B18');
      drawEngravedGear(ctx, 13, -5, 7.5, 8, railState.wheelAngle, '#FAF7F0', '#1C1B18');

      // Connecting Brass Piston Rod between wheels
      const rodOffsetX = Math.cos(railState.wheelAngle) * 3;
      const rodOffsetY = Math.sin(railState.wheelAngle) * 3;
      ctx.strokeStyle = '#1C1B18';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-13 + rodOffsetX, -5 + rodOffsetY);
      ctx.lineTo(13 + rodOffsetX, -5 + rodOffsetY);
      ctx.stroke();

      ctx.restore();

      requestAnimationFrame(animateChronosphere);
    }

    /**
     * ============================================================================
     * EVENT LISTENERS & INITIALIZATION
     * ============================================================================
     */
    el.startGameBtn.addEventListener('click', async () => {
      showToast('Loading the answer archive…');
      await answerKnowledgeReady;
      const count = window.AnswerRecognition?.stats.entities || 0;
      showToast(count ? `Answer archive ready · ${count.toLocaleString()} entities` : 'Curated answer archive ready');
      startRound(0);
    });
    el.guessForm.addEventListener('submit', handleGuessSubmit);
    el.guessInput.addEventListener('input', () => {
      el.inputFeedbackMsg.classList.add('hidden');
    });
    el.chronoFreezeBtn.addEventListener('click', activateChronoFreeze);
    el.skipRoundBtn.addEventListener('click', () => {
      if (gameState.phase !== 'playing') return;
      clearInterval(gameState.timerInterval);
      clearTimeout(gameState.freezeTimeout);
      gameState.isFrozen = false;
      completeRound(null, 'Coasted Empty');
    });
    el.nextRoundBtn.addEventListener('click', advanceFromFeedback);
    el.copyChronologBtn.addEventListener('click', copyChronoLog);
    el.playPracticeBtn.addEventListener('click', async () => {
      await answerKnowledgeReady;
      const nextSeed = (currentSeedIndex + 1) % GAME_EXPEDITIONS.length;
      initGame(nextSeed);
      startRound(0);
    });
    el.switchSeedTopBtn.addEventListener('click', () => {
      const nextSeed = (currentSeedIndex + 1) % GAME_EXPEDITIONS.length;
      initGame(nextSeed);
    });

    // Modal controls
    el.howToBtn.addEventListener('click', () => el.howToModal.classList.remove('hidden'));
    el.closeModalBtn.addEventListener('click', () => el.howToModal.classList.add('hidden'));
    el.gotItBtn.addEventListener('click', () => el.howToModal.classList.add('hidden'));
    el.howToModal.addEventListener('click', (e) => {
      if (e.target === el.howToModal) el.howToModal.classList.add('hidden');
    });

    // Global keyboard shortcut: Enter advances on start or feedback screens
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && el.howToModal.classList.contains('hidden')) {
        if (gameState.phase === 'start') {
          e.preventDefault();
          startRound(0);
        } else if (gameState.phase === 'feedback' && document.activeElement !== el.nextRoundBtn) {
          e.preventDefault();
          advanceFromFeedback();
        }
      } else if (e.key === 'Escape') {
        el.howToModal.classList.add('hidden');
      }
    });

    window.addEventListener('resize', resizeChronosphereCanvas);

    window.onload = function () {
      resizeChronosphereCanvas();
      initGame(0);
      animateChronosphere();
    };
})();

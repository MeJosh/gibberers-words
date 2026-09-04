import { useMemo, useState } from 'preact/hooks';

import { RewardIcon } from './components/reward-icon';
import { drawCard } from './lib/draw-card';
import {
  gameDataResult,
  type GameData,
  type Generation,
  rewardCodes,
  rewardDetails,
  type WordChoice,
} from './lib/game-data';

const generations: Generation[] = [1, 2, 3, 4, 5];

function getSortedRewards(choice: WordChoice) {
  return [...choice.categories].sort(
    (left, right) => rewardDetails[left].order - rewardDetails[right].order,
  );
}

export function App() {
  if (!gameDataResult.success) {
    return (
      <main class="error-page">
        <section class="error-card" role="alert">
          <span class="eyebrow">Unable to start</span>
          <h1>The word deck could not be loaded.</h1>
          <p>Please refresh the page. If the problem continues, the deck data needs attention.</p>
        </section>
      </main>
    );
  }

  return <Game data={gameDataResult.data} />;
}

function Game({ data }: { data: GameData }) {
  const [generation, setGeneration] = useState<Generation>(1);
  const [drawnCards, setDrawnCards] = useState<Record<Generation, number | undefined>>(() => ({
    1: drawCard(data, 1).card_number,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
  }));

  const currentCard = useMemo(() => {
    const selectedNumber = drawnCards[generation];
    const cards = data[generation.toString() as keyof typeof data];
    return selectedNumber === undefined
      ? drawCard(data, generation)
      : (cards.find((card) => card.card_number === selectedNumber) ?? drawCard(data, generation));
  }, [data, drawnCards, generation]);

  function chooseGeneration(nextGeneration: Generation) {
    setDrawnCards((current) =>
      current[nextGeneration] === undefined
        ? { ...current, [nextGeneration]: drawCard(data, nextGeneration).card_number }
        : current,
    );
    setGeneration(nextGeneration);
  }

  function drawAnotherCard() {
    const nextCard = drawCard(data, generation, currentCard.card_number);
    setDrawnCards((current) => ({ ...current, [generation]: nextCard.card_number }));
  }

  return (
    <main class="app-shell" data-generation={generation}>
      <div class="ambient ambient--one" />
      <div class="ambient ambient--two" />

      <header class="app-header">
        <div class="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <h1>Word Generator</h1>
        </div>
      </header>

      <section class="game-panel" aria-labelledby="generation-heading">
        <div class="generation-header">
          <div>
            <div>
              <h2 id="generation-heading">Choose a generation</h2>
              <p>Higher generations are more challenging.</p>
            </div>
          </div>
          <span class="difficulty-label">Difficulty</span>
        </div>

        <fieldset class="generation-picker">
          <legend class="sr-only">Choose a generation</legend>
          {generations.map((value) => (
            <button
              aria-pressed={generation === value}
              class={generation === value ? 'generation-button is-active' : 'generation-button'}
              data-generation={value}
              key={value}
              onClick={() => chooseGeneration(value)}
              type="button"
            >
              <span class="generation-label">Generation</span>
              <strong>{value}</strong>
            </button>
          ))}
        </fieldset>
      </section>

      <section class="card-section" aria-labelledby="card-heading" aria-live="polite">
        <div class="card-heading-row" key={`heading-${generation}-${currentCard.card_number}`}>
          <div>
            <div>
              <p class="card-kicker">Generation {generation}</p>
              <h2 id="card-heading">Your five words</h2>
            </div>
          </div>
          <span class="card-number" aria-label={`Card ${currentCard.card_number}`}>
            Card {String(currentCard.card_number).padStart(2, '0')}
          </span>
        </div>

        <ol class="word-list" key={`words-${generation}-${currentCard.card_number}`}>
          {currentCard.words.map((choice, index) => (
            <li class="word-row" key={`${currentCard.card_number}-${choice.word}`}>
              <span class="word-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span class="word-text">{choice.word}</span>
              <span class="reward-list">
                {getSortedRewards(choice).map((reward, rewardIndex) => (
                  <RewardIcon code={reward} key={`${reward}-${rewardIndex}`} />
                ))}
              </span>
            </li>
          ))}
        </ol>

        <button class="draw-button" onClick={drawAnotherCard} type="button">
          <span>Draw another card</span>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6" />
          </svg>
        </button>
      </section>

      <aside class="legend" aria-labelledby="legend-heading">
        <h2 id="legend-heading">Reward key</h2>
        <ul>
          {rewardCodes.map((code) => (
            <li key={code}>
              <RewardIcon code={code} labelled={false} />
              <span>{rewardDetails[code].shortName}</span>
            </li>
          ))}
        </ul>
      </aside>

      <footer>
        <span>Pick a word and give your team the clue.</span>
        <span aria-hidden="true">◆</span>
      </footer>
    </main>
  );
}

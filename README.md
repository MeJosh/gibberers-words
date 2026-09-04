# Word Generator

A responsive companion app for a team word game. Choose one of five generations, draw a
predefined card, and use the five displayed words during the round. Each word shows the color
and icon of its associated rewards; choices and scoring happen outside the app.

## Development

Requirements: Node.js 24 or newer and pnpm 11.

```sh
pnpm install
pnpm dev
```

Useful commands:

```sh
pnpm check      # formatting, linting, types, and unit tests
pnpm build      # production build
pnpm test:e2e   # responsive browser smoke tests
```

The project uses Vite, Preact, TypeScript, Tailwind CSS, and Zod. Oxlint and Oxfmt handle code
quality and formatting. Husky runs those checks on staged files before each commit.

Commit messages are validated by Husky and Commitlint using the Conventional Commits format:

```text
feat: add a new game option
fix(rewards): preserve repeated icons
docs: clarify deployment setup
```

## Word data

The deck lives in [`data/words.json`](data/words.json). Zod validates it when the app loads, and
the test suite verifies the complete bundled dataset. Every card must contain exactly five word
choices. Reward codes are:

| Code | Reward     |
| ---- | ---------- |
| `Y`  | Daily      |
| `B`  | Concept    |
| `G`  | Scientific |
| `R`  | Military   |
| `P`  | Wonder     |

Reward codes may be repeated for a word. Each occurrence is rendered because it represents a
separate reward.

## Deployment

Pushes to `main` are automatically built and published through the GitHub Pages workflow. In the
repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** once.

## Attribution

This project was originally forked from
[`kjmahalingam/word-generator`](https://github.com/kjmahalingam/word-generator). Thank you to the
original author for creating the prototype and initial word deck.

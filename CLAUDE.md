# ember-cli-crowdin

`@outdoorsyco/ember-cli-crowdin` is an Ember CLI addon that integrates Crowdin i18n workflows into Ember apps — providing CLI commands for syncing/validating translations, a `postBuild` validation hook, and optional Crowdin in-context localization (`ember-cli` `^3.1.4`, `ember-source` `^2.18.2`, `@outdoorsyco/crowdin-api`, `crowdin-node`).

- **Default / base branch:** `master`
- **Package manager:** Yarn (`yarn.lock`; `engines.node`: `8.* || >= 10.*`, CircleCI uses `circleci/node:10-browsers`)

## Directory Layout

- `addon/` — `instance-initializers/` and `utils/` (in-context localization runtime)
- `app/` — Re-exports merged into consuming apps
- `blueprints/ember-cli-crowdin/` — Blueprint that generates `config/crowdin.js`
- `config/` — `ember-try.js` and `environment.js`
- `lib/commands/` — Ember CLI commands: `build.js`, `check.js`, `download.js`, `report.js`, `setup.js`, `upload.js`, `validate.js`
- `lib/utils/` — Node helpers shared by the CLI commands
- `tests/` — QUnit tests and `tests/dummy/` app
- `index.js` — Addon entry point (registers commands, `postBuild` validation, and `excludeFromBuild` tree filtering)
- `.circleci/config.yml` — CircleCI 2.0 lint, test, and publish pipeline

## Commands

```bash
yarn install                                                         # install dependencies
yarn start                                                           # ember serve
yarn build                                                           # ember build

yarn lint:js                                                         # eslint ./*.js addon addon-test-support app config lib server test-support tests
yarn test                                                            # ember test
node_modules/.bin/ember try:one ember-release --skip-cleanup --reporter=dot  # Ember release compatibility test (run in CI)
```

## Key Conventions & Gotchas

- **CLI command names:** `index.js` registers `i18n:check`, `i18n:report`, `i18n:validate`, `i18n:build`, `i18n:download`, `i18n:setup`, and `i18n:upload` (not `crowdin:*` as shown in the older `README.md`).
- **`postBuild` validation:** When `VALIDATE` is set in the environment for non-`test`, non-`development` builds of a consuming app, `index.js` runs `lib/commands/validate` against the build output and throws on failure.
- **Excluding in-context scripts:** Setting `crowdin.excludeFromBuild: true` in a consuming app's `config/environment.js` strips `in-context` and `inject-script` files from `app` and `addon` trees via `broccoli-funnel`.
- **CI & auto-publish:** `.circleci/config.yml` (`must_pass` workflow) runs `yarn lint:js`, `yarn test`, and `ember try:one ember-release`, then runs `yarn deploy:ci` + `npm publish` on `master`. Do not run `deploy`, `deploy:ci`, or `push:git` manually from feature branches.
- **Code comments:** Default to no comments. Only add a short comment when the WHY is non-obvious (a hidden constraint, workaround, or subtle invariant) — never explain WHAT the code does. No multi-line comment blocks or long docstrings, and never put Jira ticket keys in code or comments.

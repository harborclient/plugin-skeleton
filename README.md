# HarborClient Plugin Skeleton

Starter template for HarborClient plugins with renderer UI (JSX) and a main-process HTTP hook.

## Features

- Official JSX runtime via `@harborclient/plugin-api` (`installReact`, hook barrel)
- Settings section with persistent storage
- Footer panel following the host layout contract
- Main entry logging `onAfterSend` exchanges

## Setup

```bash
pnpm install
pnpm build
```

Load the project folder in HarborClient via **Settings → Plugins → Load unpacked…**.

Requires `@harborclient/plugin-api@^0.2.0` from npm.

## Local plugin-api development

Do not commit `file:` paths in `package.json`. To test against a local `@harborclient/plugin-api` checkout without changing tracked files, use one of:

- `pnpm link` from the published package directory after `pnpm pack` in `packages/plugin-api`
- A gitignored override file (for example `.pnpmfile.cjs` or a local-only `pnpm-workspace.yaml` entry) that only exists on your machine

## Development

```bash
pnpm dev
```

Rebuilds `dist/renderer.js` and `dist/main.js` on change. Keep a contributed UI surface open for hot reload.

## Customize

1. Change `id`, `name`, and `contributes` in `manifest.json`.
2. Replace example components under `src/components/`.
3. Adjust permissions to match your plugin's needs.

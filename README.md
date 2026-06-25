# HarborClient Plugin Skeleton

Starter template for HarborClient plugins with renderer UI (JSX) and a main-process HTTP hook.

## Features

- Official JSX runtime via `@harborclient/sdk` (`installReact`, hook barrel)
- Settings section with persistent storage
- Footer panel following the host layout contract
- Main entry logging `onAfterSend` exchanges

## Setup

```bash
pnpm install
pnpm build
```

Load the project folder in HarborClient via **Settings → Plugins → Load unpacked…**.

Requires `@harborclient/sdk@^0.4.0` from npm.

## Sign and verify

After building entry files, sign the plugin directory (this repository root) with an Ed25519 key:

```bash
pnpm plugin:sign -- --dir . --private-key /path/to/signing.pem --key-id my-publisher
pnpm plugin:verify -- --dir . --public-key /path/to/public.key
```

See the [@harborclient/sdk signing docs](https://harborclient.github.io/sdk/signing) for key generation and `signature.json` format.

## Local SDK development

Do not commit `file:` paths in `package.json`. To test against a local `@harborclient/sdk` checkout without changing tracked files, use one of:

- `pnpm link` from the published package directory after `pnpm pack` in `packages/sdk`
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

## Token Tango Widget Codebase

This codebase utilizes the [Radius Toolkit](../../packages/radius-toolkit/README.md) to create a simple widget that validates and manages tokens in Figma using naming conventions supported by Token Tango.

## Repository structure

```
root/
  apps/
    token-tango-widget/
      src/ (source code -- native Figma plugin code)
      package.json  (build: build the figma widget with **ESBuild**). depends on all monorepo packages. Dev depends on token-tango-widget-ui
      tsconfig.json
    token-tango-widget-ui/
      src/ (source code -- React WebUI code)
      package.json (build: build the figma widget WebUI using **Vite**). depends on all monorepo packages.
      tsconfig.json
  packages/
    radius-toolkit/
      src/ (source code -- pure typescript library code)
      package.json (build and publishes a library named 'radius-toolkit' using **Vite**). no other dependencies in the repo
      tsconfig.json (noEmit = true as compilation is done by vite)
      vite.config.ts (vite configuration for building the library)
      vite.config.cli.ts (vite configuration for building the cli)
      vitest.config.ts (vite configuration for running tests)
    repository-config/
      src/ (source code -- pure typescript library code)
      package.json (internal package to manage the repository configuration. currently does not build -- only type-checks. I am assuming other bundlers will incorporate this source in their bundle). no other dependencies in the repo
      tsconfig.json (noEmit = true)
    utils/
      src/ (source code -- pure typescript library code)
      package.json (internal package with some utility functions. currently does not build -- only type-checks. I am assuming other bundlers will incorporate this source in their bundle). no other dependencies in the repo)
      tsconfig.json (noEmit = true)
  package.json (monorepo root package.json. uses turborepo and pnpm to manage the monorepo. build calls 'turborepo run build' which builds all packages)
```

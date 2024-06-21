import { defineConfig } from "vite";
import { resolve } from "path";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [commonjs()],
  build: {
    outDir: "dist/cli",
    target: "node20",
    rollupOptions: {
      input: resolve(__dirname, "src/cli.ts"),
      output: {
        format: "cjs",
        entryFileNames: "cli.cjs.js",
        banner: "#!/usr/bin/env node",
        inlineDynamicImports: true,
      },
      external: [
        "node:events",
        "node:fs",
        "node:path",
        "node:process",
        "node:child_process",
        "node:readline",
        "node:stream",
        "node:util",
      ],
    },
  },
});

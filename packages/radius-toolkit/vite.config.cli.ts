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
        /^node:.*/,
        "fs",
        "path",
        "os",
        "crypto",
        "module",
        "perf_hooks",
        "vm",
        "url",
        "assert",
        "process",
        "v8",
        "util",
        "tty",
        "events",
        "child_process",
        "readline",
        "stream",
        // own library (externalized templates need to import it directly)
        "radius-toolkit",
      ],
    },
    minify: false,
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["jiti"],
  },
});

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RadiusToolkit",
      fileName: (format) => `radius-toolkit.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["radius-toolkit"],
      output: {
        globals: {},
      },
    },
    outDir: "dist/lib",
  },
  plugins: [
    dts({
      outDir: "dist/lib/types",
    }),
  ],
});

import path from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  root: ".",
  plugins: [viteSingleFile()],
  resolve: {
    alias: {
      "!../css": path.resolve(
        __dirname,
        "./node_modules/@create-figma-plugin/ui/lib/css"
      ),
    },
  },
  build: {
    sourcemap: false,
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "./dist",
    cssMinify: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});

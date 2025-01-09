import path from "path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDebug = mode === "debug";
  console.log("command", command);
  console.log("mode", mode);
  console.log("isDebug", isDebug);
  return {
    root: ".",
    plugins: [viteSingleFile()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "@"),
      },
    },
    build: {
      // Enable source maps in debug mode
      sourcemap: isDebug ? "inline" : false,
      target: "esnext",
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
      cssCodeSplit: false,
      outDir: "./dist",
      // Only minify CSS in production
      cssMinify: !isDebug,
      // Disable minification in debug mode
      minify: isDebug ? false : "esbuild",
      // Add more detailed build options for debugging
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          // Preserve module structure in debug mode
          format: isDebug ? "esm" : "iife",
        },
      },
    },
  };
});

import * as esbuild from "esbuild";

const context = await esbuild.context({
  entryPoints: ["src/code.tsx"],
  bundle: true,
  outfile: "dist/code.js",
  sourcemap: true,
  sourcesContent: true,
  keepNames: true,
  metafile: true,
  target: "es6",
  minify: false,
});

await context.watch();

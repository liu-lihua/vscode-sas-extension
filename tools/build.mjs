console.log("start");
const dev = process.argv[2];
import esbuild from "esbuild";

const plugins = [
  {
    name: "watch-plugin",
    setup(build) {
      build.onEnd((result) => {
        // for VS Code task tracking
        console.log("start");
        console.log("end");
      });
    },
  },
];

const buildOptions = {
  entryPoints: {
    "./client/dist/node/extension": "./client/src/node/extension.ts",
    "./server/dist/node/server": "./server/src/node/server.ts",
    "./client/dist/webview/DataViewer": "./client/src/webview/DataViewer.tsx",
  },
  bundle: true,
  outdir: ".",
  platform: "node",
  external: ["vscode"],
  loader: {
    ".properties": "text",
    ".node": "copy",
  },
  sourcemap: !!dev,
  minify: !dev,
  plugins: dev ? plugins : [],
  define: {
    "process.env.NODE_ENV": dev ? `"development"` : `"production"`,
  },
};

const ctx = await esbuild.context(buildOptions);
await ctx.rebuild();

if (dev) {
  await ctx.watch();
} else {
  await ctx.dispose();
}

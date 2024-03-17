import { defineConfig } from "vite";
import manifest from "./src/manifest.json";
import { crx } from "@crxjs/vite-plugin";

const DEBUG = false;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: !DEBUG,
    target: "esnext",
    rollupOptions: {
      input: {
        manual: "src/page/manual.html",
      },
    },
  },
  esbuild: {
    minifyWhitespace: !DEBUG,
    minifyIdentifiers: !DEBUG,
  },
  plugins: [crx({ manifest })],
});

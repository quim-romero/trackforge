import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE
      ? visualizer({
          filename: "dist/stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : undefined,
  ].filter(Boolean),
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});

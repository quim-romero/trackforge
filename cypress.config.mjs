import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
  },
  video: false,
});

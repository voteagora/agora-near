import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "src/__mocks__/**",
        "coverage/**",
        "dist/**",
        ".next/**",
        "cypress/**",
        "src/scripts/**",
        "src/pages/**", // Next.js pages
        "src/app/layout.tsx", // Next.js app layout
        "src/instrumentation.ts",
        "src/instrumentation.node.ts",
        "src/middleware.ts",
      ],
    },
  },
});

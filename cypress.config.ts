import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 12000,
    scrollBehavior: "center",
    testIsolation: false,
    video: true,
    setupNodeEvents(on, config) {
      console.log("setupNodeEvents", process.env);
      config.env.CYPRESS_EMAIL = process.env.CYPRESS_EMAIL;
      config.env.CYPRESS_PASSWORD = process.env.CYPRESS_PASSWORD;

      return config;
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});

import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'tests/e2e', fullyParallel:true, workers:2, retries:process.env.CI?1:0,
 use:{baseURL:'http://127.0.0.1:4321/econ-nobel/',trace:'retain-on-failure'},
 // Astro 7 can auto-background when launched by an agent. Playwright must own
 // a foreground process so startup and teardown remain reliable.
 webServer:{command:'npm run preview -- --port 4321 --ignore-lock',url:'http://127.0.0.1:4321/econ-nobel/',reuseExistingServer:!process.env.CI,timeout:30000},
 reporter:[['list']],
});

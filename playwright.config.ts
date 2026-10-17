import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'tests/e2e', fullyParallel:true, workers:2, retries:process.env.CI?1:0,
 use:{baseURL:'http://127.0.0.1:4321/econ-nobel/',trace:'retain-on-failure'},
 webServer:{command:'npm run preview -- --port 4321',url:'http://127.0.0.1:4321/econ-nobel/',reuseExistingServer:!process.env.CI,timeout:30000},
 reporter:[['list']],
});

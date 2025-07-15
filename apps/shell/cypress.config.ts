import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 720,
  // Aumentar timeouts para microfrontends
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  responseTimeout: 15000,
  pageLoadTimeout: 30000,
  // Configurações específicas para microfrontends
  retries: {
    runMode: 2,
    openMode: 0
  },
  env: {
    // URLs dos microfrontends para testes
    CLIENTS_MF_URL: 'http://localhost:3001',
    SELECTED_MF_URL: 'http://localhost:3002'
  }
})

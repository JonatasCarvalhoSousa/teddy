/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('João Silva')
       */
      login(name: string): Chainable<void>

      /**
       * Custom command to wait for loading to finish
       * @example cy.waitForLoading()
       */
      waitForLoading(): Chainable<void>

      /**
       * Custom command to create a test client
       * @example cy.createTestClient('João Silva', 5000, 50000)
       */
      createTestClient(name: string, salary: number, companyValuation: number): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (name: string) => {
  cy.visit('/')
  cy.get('input[placeholder*="nome"]').type(name)
  cy.get('button').contains('Entrar').click()
  cy.url().should('include', '/clients')
})

Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist')
})

Cypress.Commands.add('createTestClient', (name: string, salary: number, companyValuation: number) => {
  cy.get('button').contains('Criar cliente').click()
  cy.get('input[placeholder*="nome"]').type(name)
  cy.get('input[type="number"]').first().type(salary.toString())
  cy.get('input[type="number"]').last().type(companyValuation.toString())
  cy.get('button').contains('Criar').click()
})

export {}

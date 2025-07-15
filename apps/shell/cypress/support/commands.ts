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

      /**
       * Custom command to wait for microfrontend to load
       * @example cy.waitForMicrofrontend('clients')
       */
      waitForMicrofrontend(type: 'clients' | 'selected'): Chainable<void>

      /**
       * Custom command to check microfrontend health
       * @example cy.checkMicrofrontendHealth()
       */
      checkMicrofrontendHealth(): Chainable<void>
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
  cy.get('input[placeholder*="salário"], input[placeholder*="Salário"]').type(salary.toString())
  cy.get('input[placeholder*="empresa"], input[placeholder*="Empresa"]').type(companyValuation.toString())
  cy.get('[data-testid="modal-overlay"]').within(() => {
    cy.get('button').contains('Criar').click()
  })
  cy.contains('criado com sucesso', { timeout: 10000 }).should('be.visible')
})

Cypress.Commands.add('waitForMicrofrontend', (type: 'clients' | 'selected') => {
  if (type === 'clients') {
    cy.contains('clientes encontrados', { timeout: 20000 }).should('be.visible')
  } else {
    cy.contains('Clientes Selecionados', { timeout: 20000 }).should('be.visible')
  }
  // Aguardar estabilização
  cy.wait(1000)
})

Cypress.Commands.add('checkMicrofrontendHealth', () => {
  // Verificar se não há mensagens de erro de microfrontend
  cy.get('body').should('not.contain', 'Erro ao carregar o módulo')
  cy.get('body').should('not.contain', 'Verifique se o serviço está rodando')
  
  // Verificar se elementos essenciais estão presentes
  cy.get('main').should('be.visible')
})
  cy.get('input[type="number"]').first().type(salary.toString())
  cy.get('input[type="number"]').last().type(companyValuation.toString())
  cy.get('button').contains('Criar').click()
})

export {}

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('should display login page initially', () => {
    cy.visit('/')
    cy.contains('Olá, seja bem-vindo!').should('be.visible')
    cy.get('input[placeholder*="nome"]').should('be.visible')
    cy.get('button').contains('Entrar').should('be.visible')
  })

  it('should require name input', () => {
    cy.visit('/')
    // Verificar que o botão está desabilitado quando o campo está vazio
    cy.get('button').contains('Entrar').should('be.disabled')
    
    // Verificar que o campo de input está vazio
    cy.get('input[placeholder*="nome"]').should('have.value', '')
    
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should login successfully with valid name', () => {
    cy.visit('/')
    cy.get('input[placeholder*="nome"]').type('João Silva')
    cy.get('button').contains('Entrar').click()
    
    cy.url().should('include', '/clients')
    cy.contains('clientes encontrados').should('be.visible')
  })

  it('should persist login state', () => {
    cy.login('João Silva')
    
    cy.reload()
    
    cy.url().should('include', '/clients')
  })

  it('should logout and redirect to login', () => {
    cy.login('João Silva')
    
    cy.get('button').contains('Sair').click()
    
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Olá, seja bem-vindo!').should('be.visible')
  })
})

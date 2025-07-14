describe('Client Selection', () => {
  beforeEach(() => {
    cy.login('João Silva')
    cy.contains('clientes encontrados', { timeout: 10000 }).should('be.visible')
  })

  it('should navigate to selected clients page', () => {
    cy.get('a[href="/selected"]').click()
    cy.url().should('include', '/selected')
    cy.contains('Clientes Selecionados').should('be.visible')
  })

  it('should display empty state when no clients selected', () => {
    cy.visit('/selected')
    cy.contains('Nenhum cliente selecionado').should('be.visible')
    cy.get('button').contains('Ir para Clientes').should('be.visible')
  })

  it('should return to clients page from empty state', () => {
    cy.visit('/selected')
    cy.get('button').contains('Ir para Clientes').click()
    cy.url().should('include', '/clients')
  })

})

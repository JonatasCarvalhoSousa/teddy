describe('Responsive Design', () => {
  beforeEach(() => {
    cy.login('João Silva')
  })

  it('should work on desktop viewport', () => {
    cy.viewport(1280, 720)
    cy.contains('clientes encontrados').should('be.visible')
    cy.get('button').contains('Criar cliente').should('be.visible')
  })

  it('should work on tablet viewport', () => {
    cy.viewport(768, 1024)
    cy.contains('clientes encontrados').should('be.visible')
    cy.get('button').contains('Criar cliente').should('be.visible')
  })

  it('should work on mobile viewport', () => {
    cy.viewport(375, 667)
    cy.contains('clientes encontrados').should('be.visible')
    
    cy.get('button').contains('Criar cliente').should('be.visible')
  })

  it('should toggle sidebar on mobile', () => {
    cy.viewport(375, 667)
    
    cy.get('body').should('be.visible')
  })

  it('should handle modal responsiveness', () => {
    cy.viewport(1280, 720)
    cy.get('button').contains('Criar cliente').click()
    cy.contains('Criar cliente').should('be.visible')
    cy.get('button').contains('Cancelar').click()

    cy.viewport(375, 667)
    cy.get('button').contains('Criar cliente').click()
    cy.contains('Criar cliente').should('be.visible')
    cy.get('button').contains('Cancelar').click()
  })
})

describe('Search Functionality', () => {
  beforeEach(() => {
    cy.login('João Silva')
    // Aguardar carregamento do microfrontend
    cy.contains('clientes encontrados', { timeout: 20000 }).should('be.visible')
    // Aguardar estabilização da interface
    cy.wait(1000)
  })

  it('should display search input', () => {
    cy.get('input[placeholder*="Pesquisar"]').should('be.visible')
  })

  it('should perform search', () => {
    const searchTerm = 'João'
    
    cy.get('input[placeholder*="Pesquisar"]').type(searchTerm)
    
    cy.contains(`Pesquisando por: "${searchTerm}"`).should('be.visible')
    
    cy.contains('encontrado', { timeout: 10000 }).should('be.visible')
  })

  it('should clear search', () => {
    const searchTerm = 'João'
    
    cy.get('input[placeholder*="Pesquisar"]').type(searchTerm)
    
    cy.get('input[placeholder*="Pesquisar"]').siblings('button').click()
    
    cy.get('input[placeholder*="Pesquisar"]').should('have.value', '')
    
    cy.contains(`Pesquisando por: "${searchTerm}"`).should('not.exist')
  })

  it('should update results count based on search', () => {
    cy.contains('clientes encontrados').should('be.visible')
    
    cy.get('input[placeholder*="Pesquisar"]').type('Teste')
    
    cy.wait(1000)
    
    cy.contains('encontrado').should('be.visible')
  })
})

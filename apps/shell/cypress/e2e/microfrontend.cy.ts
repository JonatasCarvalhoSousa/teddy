describe('Microfrontend Integration', () => {
  beforeEach(() => {
    cy.login('João Silva')
  })

  it('should load clients microfrontend successfully', () => {
    cy.visit('/clients')
    
    // Verificar se o microfrontend carregou
    cy.contains('clientes encontrados', { timeout: 15000 }).should('be.visible')
    
    // Verificar se a interface está funcional
    cy.get('button').contains('Criar cliente').should('be.visible')
    cy.get('input[placeholder*="Pesquisar"]').should('be.visible')
  })

  it('should load selected microfrontend successfully', () => {
    cy.visit('/selected')
    
    // Verificar se o microfrontend carregou
    cy.contains('Clientes Selecionados', { timeout: 15000 }).should('be.visible')
  })

  it('should handle microfrontend errors gracefully', () => {
    // Simular erro de rede interceptando a requisição
    cy.intercept('GET', '**/remoteEntry.js', { statusCode: 500 }).as('moduleError')
    
    cy.visit('/clients', { failOnStatusCode: false })
    
    // Verificar se a mensagem de erro é exibida
    cy.contains('Erro ao carregar', { timeout: 10000 }).should('be.visible')
    cy.get('button').contains('Tentar Novamente').should('be.visible')
  })

  it('should communicate between shell and microfrontends', () => {
    cy.visit('/clients')
    
    // Aguardar carregamento
    cy.contains('clientes encontrados', { timeout: 15000 }).should('be.visible')
    
    // Simular seleção de cliente (comunicação via eventBus)
    cy.get('[data-testid="client-card"]').first().within(() => {
      cy.get('input[type="checkbox"]').check()
    })
    
    // Navegar para selected e verificar se o estado foi comunicado
    cy.get('a[href="/selected"]').click()
    cy.url().should('include', '/selected')
    
    // Verificar se o cliente selecionado aparece
    cy.contains('cliente selecionado', { timeout: 10000 }).should('be.visible')
  })

  it('should maintain state across microfrontend navigation', () => {
    cy.visit('/clients')
    cy.contains('clientes encontrados', { timeout: 15000 }).should('be.visible')
    
    // Realizar uma busca
    const searchTerm = 'João'
    cy.get('input[placeholder*="Pesquisar"]').type(searchTerm)
    cy.contains(`Pesquisando por: "${searchTerm}"`).should('be.visible')
    
    // Navegar para outra página e voltar
    cy.get('a[href="/selected"]').click()
    cy.get('a[href="/clients"]').click()
    
    // Verificar se o estado foi mantido
    cy.get('input[placeholder*="Pesquisar"]').should('have.value', searchTerm)
  })

  it('should handle concurrent microfrontend operations', () => {
    cy.visit('/clients')
    cy.contains('clientes encontrados', { timeout: 15000 }).should('be.visible')
    
    // Abrir modal de criação
    cy.get('button').contains('Criar cliente').click()
    cy.contains('Criar cliente').should('be.visible')
    
    // Preencher dados
    cy.get('input[placeholder*="nome"]').type('Cliente Teste Concurrent')
    cy.get('input[placeholder*="salário"], input[placeholder*="Salário"]').type('6000')
    cy.get('input[placeholder*="empresa"], input[placeholder*="Empresa"]').type('60000')
    
    // Criar cliente
    cy.get('[data-testid="modal-overlay"]').within(() => {
      cy.get('button').contains('Criar').click()
    })
    
    // Verificar criação bem-sucedida
    cy.contains('criado com sucesso', { timeout: 10000 }).should('be.visible')
    
    // Navegar para selected imediatamente (teste de concorrência)
    cy.get('a[href="/selected"]').click()
    cy.url().should('include', '/selected')
  })

  it('should handle microfrontend lazy loading', () => {
    // Limpar cache para forçar lazy loading
    cy.clearLocalStorage()
    cy.clearCookies()
    
    cy.visit('/')
    cy.get('input[placeholder*="nome"]').type('João Silva')
    cy.get('button').contains('Entrar').click()
    
    // Verificar carregamento progressivo
    cy.url().should('include', '/clients')
    
    // Primeiro acesso - pode demorar mais
    cy.contains('clientes encontrados', { timeout: 20000 }).should('be.visible')
    
    // Segundo acesso - deve ser mais rápido
    cy.get('a[href="/selected"]').click()
    cy.contains('Clientes Selecionados', { timeout: 10000 }).should('be.visible')
    
    cy.get('a[href="/clients"]').click()
    cy.contains('clientes encontrados', { timeout: 5000 }).should('be.visible')
  })
})

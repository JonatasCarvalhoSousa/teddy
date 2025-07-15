describe('Clients CRUD Operations', () => {
  beforeEach(() => {
    cy.login('João Silva')
    // Aguardar carregamento do microfrontend com timeout maior
    cy.contains('clientes encontrados', { timeout: 20000 }).should('be.visible')
    // Aguardar estabilização da interface
    cy.wait(1000)
  })

  it('should display clients list', () => {
    cy.contains('clientes encontrados').should('be.visible')
    cy.get('button').contains('Criar cliente').should('be.visible')
  })

  it('should open create client modal', () => {
    cy.get('button').contains('Criar cliente').click()
    cy.contains('Criar cliente').should('be.visible')
    cy.get('input[placeholder*="nome"]').should('be.visible')
    cy.get('input[type="number"]').should('have.length', 2)
  })

  it('should create a new client', () => {
    const clientName = `Cliente Teste ${Date.now()}`
    
    cy.get('button').contains('Criar cliente').click()
    
    // Aguardar o modal abrir
    cy.contains('Criar cliente').should('be.visible')
    
    // Usar seletores mais específicos para os campos
    cy.get('input[placeholder*="nome"]').clear().type(clientName)
    cy.get('input[placeholder*="salário"], input[placeholder*="Salário"]').clear().type('5000')
    cy.get('input[placeholder*="empresa"], input[placeholder*="Empresa"]').clear().type('50000')
    
    // Clicar no botão Criar dentro do modal
    cy.get('[data-testid="modal-overlay"]').within(() => {
      cy.get('button').contains('Criar').click()
    })
    
    // Verificar se o modal fechou
    cy.contains('Criar cliente').should('not.exist')
    
    // Verificar mensagem de sucesso
    cy.contains('criado com sucesso', { timeout: 10000 }).should('be.visible')
  })

  it('should validate required fields', () => {
    cy.get('button').contains('Criar cliente').click()
    
    // Aguardar o modal abrir
    cy.contains('Criar cliente').should('be.visible')
    
    // Tentar clicar no botão Criar sem preencher campos
    cy.get('[data-testid="modal-overlay"]').within(() => {
      cy.get('button').contains('Criar').should('be.disabled')
    })
    
    // Modal deve continuar visível
    cy.contains('Criar cliente').should('be.visible')
  })

  it('should close modal on cancel', () => {
    cy.get('button').contains('Criar cliente').click()
    
    // Aguardar o modal abrir
    cy.contains('Criar cliente').should('be.visible')
    
    // Clicar no botão Cancelar dentro do modal
    cy.get('[data-testid="modal-overlay"]').within(() => {
      cy.get('button').contains('Cancelar').click()
    })
    
    // Verificar se o modal fechou
    cy.get('[data-testid="modal-overlay"]').should('not.exist')
  })

  it('should close modal on ESC key', () => {
    cy.get('button').contains('Criar cliente').click()
    
    // Aguardar o modal abrir
    cy.contains('Criar cliente').should('be.visible')
    
    // Pressionar ESC
    cy.get('body').type('{esc}')
    
    // Verificar se o modal fechou
    cy.get('[data-testid="modal-overlay"]').should('not.exist')
  })


})

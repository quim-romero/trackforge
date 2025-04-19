describe('Smoke - core flow', () => {
  it('Guest login → crear tarea → verla en lista', () => {
    cy.visit('/');
    cy.contains(/Entrar como invitado/i).click({ force: true });

    cy.get('[data-cy="task-title"]').type('Tarea de humo');
    cy.get('[data-cy="create-task"]').click();

    cy.contains('Tarea de humo').should('be.visible');
  });
});

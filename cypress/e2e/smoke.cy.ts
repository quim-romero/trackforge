describe('Smoke - core flow', () => {
  it('Guest login → create task → view it in list', () => {
    cy.visit('/');
    cy.contains(/Enter as a guest/i).click({ force: true });

    cy.get('[data-cy="task-title"]').type('Smoke Task');
    cy.get('[data-cy="create-task"]').click();

    cy.contains('Smoke Task').should('be.visible');
  });
});

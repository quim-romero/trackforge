describe("TrackForge - smoke", () => {
  it("Guest login → create task → view it in list", () => {
    cy.visit("/");
    cy.get('[data-cy="guest-login"]').click();

    cy.get('[data-cy="task-title"]').type("Smoke Task");
    cy.get('[data-cy="create-task"]').click();

    cy.contains("Smoke Task").should("be.visible");

    cy.checkA11y();
  });
});

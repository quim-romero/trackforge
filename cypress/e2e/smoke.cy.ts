describe("TrackForge - smoke", () => {
  it("Guest login → create task → view it in list", () => {
    cy.visit("/login");

    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="guest-login"]').length) {
        cy.get('[data-cy="guest-login"]').click();
      } else {
        cy.contains(
          /(guest login|enter as a guest|continue as guest)/i
        ).click();
      }
    });

    cy.location("pathname", { timeout: 10000 }).should((p) => {
      expect(p).to.not.match(/\/login$/);
    });

    cy.visit("/tasks?new=1");

    cy.get('[data-cy="add-task-modal"]', { timeout: 10000 }).should(
      "be.visible"
    );

    const title = `Smoke Task ${Date.now()}`;
    cy.get('[data-cy="task-title"]').should("be.visible").type(title);
    cy.get('[data-cy="create-task"]').should("be.enabled").click();

    cy.contains(title, { timeout: 10000 }).should("be.visible");
  });
});

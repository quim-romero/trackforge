describe("A11y - home", () => {
  it("no serious/critical violations", () => {
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y(undefined, { includedImpacts: ["serious", "critical"] });
  });
});

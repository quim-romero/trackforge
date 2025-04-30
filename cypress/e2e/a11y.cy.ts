describe("A11y - home", () => {
  it("no critical violations", () => {
    cy.visit("/");
    cy.injectAxe();

    cy.configureAxe({
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    cy.checkA11y(undefined, { includedImpacts: ["critical"] });
  });
});

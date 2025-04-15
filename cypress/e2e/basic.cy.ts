/// <reference types="cypress" />

describe("TrackForge home page", () => {
  it("displays the main headline", () => {
    cy.visit("/");
    cy.get('[data-cy="main-headline"]').should(
      "contain.text",
      "It's not for everyone."
    );
  });
});

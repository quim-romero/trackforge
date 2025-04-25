import "./commands";
import "cypress-axe";

Cypress.Commands.add("checkA11ySafe", () => {
  cy.injectAxe();
  cy.checkA11y();
});

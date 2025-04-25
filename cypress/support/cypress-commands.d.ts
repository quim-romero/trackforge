/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      checkA11ySafe(): Chainable<void>;
    }
  }
}

export {};

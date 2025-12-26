/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to call an elevator to a specific floor
       * @example cy.callElevator(3)
       */
      callElevator(floor: number): Chainable<void>;
      
      /**
       * Custom command to wait for elevator to arrive
       * @example cy.waitForElevatorArrival(3)
       */
      waitForElevatorArrival(floor: number, timeout?: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add('callElevator', (floor: number) => {
  cy.get(`[data-testid="call-button-${floor}"]`).click();
});

Cypress.Commands.add('waitForElevatorArrival', (floor: number, timeout = 30000) => {
  cy.get(`[data-testid="call-button-${floor}"]`, { timeout })
    .should('have.attr', 'data-status', 'arrived');
});

export {};

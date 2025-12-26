import { selectors, constants } from '../support/helpers';

describe('Elevator System - Basic Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application successfully', () => {
    cy.contains('Elevator System').should('be.visible');
    cy.get(selectors.building).should('exist');
  });

  it('should display the correct number of floors and elevators', () => {
    cy.get(selectors.allFloors).should('have.length', constants.TOTAL_FLOORS);
    cy.get(selectors.allElevators).should('have.length', constants.TOTAL_ELEVATORS);
  });
});

import { helpers, selectors } from '../support/helpers';

describe('Elevator System - Algorithm & Selection', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should dispatch the closest idle elevator', () => {
    helpers.callElevatorToFloor(9);
    
    cy.get(selectors.movingElevators, { timeout: 2000 })
      .should('have.length.at.least', 1);

    helpers.callElevatorToFloor(0);

    helpers.waitForButtonStatus(0, 'arrived', 15000);
    helpers.waitForButtonStatus(9, 'arrived', 20000);
  });

  it('LOOK Algorithm: intercept mid-journey (going up, add floor ahead)', () => {
    helpers.callElevatorToFloor(9);
    cy.wait(1000);

    helpers.callElevatorToFloor(5);

    helpers.waitForButtonStatus(5, 'arrived', 15000);
    
    cy.get(selectors.callButton(9))
      .should('have.attr', 'data-status', 'waiting');
      
    helpers.waitForButtonStatus(9, 'arrived', 15000);
  });

  it('LOOK Algorithm: backtrack after completing direction', () => {
    helpers.callElevatorToFloor(8);
    cy.wait(1000);
    
    helpers.callElevatorToFloor(2);

    helpers.waitForButtonStatus(8, 'arrived', 20000);
    helpers.waitForButtonStatus(2, 'arrived', 30000);
  });

  it('should not accept duplicate floor requests', () => {
    const targetFloor = 6;
    
    helpers.callElevatorToFloor(targetFloor);
    
    cy.get(selectors.callButton(targetFloor))
      .should('have.attr', 'data-status')
      .and('match', /waiting|arrived/);
    
    cy.get(selectors.callButton(targetFloor)).then($btn => {
      const initialStatus = $btn.attr('data-status');
      
      if (initialStatus === 'waiting') {
        cy.get(selectors.callButton(targetFloor)).click({ force: true });
        
        cy.get(selectors.callButton(targetFloor))
          .should('have.attr', 'data-status', 'waiting');
      }
    });
  });
});

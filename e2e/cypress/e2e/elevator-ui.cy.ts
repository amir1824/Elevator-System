import { helpers, selectors, constants } from '../support/helpers';

describe('Elevator System - UI & Design', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show elevator movement animation', () => {
    const targetFloor = 8;
    
    helpers.callElevatorToFloor(targetFloor);
    
    cy.get(selectors.movingElevators)
      .should('have.length.at.least', 1);
  });

  it('should display timer countdown for moving elevators', () => {
    const targetFloor = 9;
    
    helpers.callElevatorToFloor(targetFloor);
    
    cy.get(selectors.allTimers, { timeout: 5000 })
      .should('be.visible')
      .and('not.be.empty');
  });

  it('should verify strict design requirements (Red/Green/2sec-Delay)', () => {
    const targetFloor = 2;
    const btn = selectors.callButton(targetFloor);
    
    helpers.callElevatorToFloor(targetFloor);

    helpers.verifyButtonStatus(targetFloor, 'waiting');
    cy.get(selectors.callButton(targetFloor))
      .should('contain.text', constants.buttonText.waiting);

    helpers.waitForButtonStatus(targetFloor, 'arrived', 15000);
    
    cy.wait(200);

    cy.get(selectors.callButton(targetFloor))
      .should('contain.text', constants.buttonText.arrived);

    cy.wait(1000);
    helpers.verifyButtonStatus(targetFloor, 'arrived');

    helpers.waitForButtonStatus(targetFloor, 'idle', 3000);
    cy.get(selectors.callButton(targetFloor))
      .should('contain.text', constants.buttonText.idle);
  });
});

import { selectors, constants, helpers } from '../support/helpers';

describe('Elevator System - Sync & Physics Risks', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should maintain visual-logical sync during movement (Mid-flight Snapshot)', () => {
    const startFloor = 0;
    const targetFloor = 9;
    const travelTime = (targetFloor - startFloor) * constants.MS_PER_FLOOR;
    const midPointTime = travelTime / 2;

    helpers.callElevatorToFloor(targetFloor);

    cy.wait(midPointTime);

    cy.get(selectors.movingElevators).first().parent().then(($el) => {
      const offset = parseFloat(window.getComputedStyle($el[0]).getPropertyValue('--offset'));
      
      expect(Math.abs(offset)).to.be.greaterThan(0);
      expect(Math.abs(offset)).to.be.lessThan(targetFloor);
    });

    helpers.waitForButtonStatus(targetFloor, 'arrived', travelTime + 2000);
  });

  it('should handle CPU lag without losing state (Simulating Desync)', () => {
    const targetFloor = 5;
    helpers.callElevatorToFloor(targetFloor);

    cy.window().then(() => {
      const start = performance.now();
      while (performance.now() - start < 200) {
      }
    });

    helpers.waitForButtonStatus(targetFloor, 'arrived', 10000);
    
    cy.get(selectors.callButton(targetFloor))
      .should('exist');
  });
});

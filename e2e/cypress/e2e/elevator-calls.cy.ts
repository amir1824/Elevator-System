import { helpers } from '../support/helpers';

describe('Elevator System - Elevator Calls', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should call an elevator to a floor', () => {
    const targetFloor = 5;
    
    helpers.callElevatorToFloor(targetFloor);
    helpers.verifyButtonStatus(targetFloor, 'waiting');
    
    helpers.waitForButtonStatus(targetFloor, 'arrived', 10000);
    helpers.waitForButtonStatus(targetFloor, 'idle', 3000);
  });

  it('should handle multiple elevator calls and reset all buttons', () => {
    const floors = [3, 7];
    
    helpers.callMultipleFloors(floors);
    helpers.verifyMultipleButtonsStatus(floors, 'waiting');
    
    helpers.waitForMultipleButtonsStatus(floors, 'arrived', 20000);
    
    helpers.waitForMultipleButtonsStatus(floors, 'idle', 5000);
  });
});

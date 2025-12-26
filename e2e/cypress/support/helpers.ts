export const selectors = {
  building: '[data-testid="building"]',
  floor: (floorNumber: number) => `[data-testid="floor-${floorNumber}"]`,
  elevator: (elevatorId: number) => `[data-testid="elevator-${elevatorId}"]`,
  callButton: (floorNumber: number) => `[data-testid="call-button-${floorNumber}"]`,
  elevatorTimer: (elevatorId: number) => `[data-testid="elevator-timer-${elevatorId}"]`,
  allFloors: '[data-testid^="floor-"]',
  allElevators: '[data-testid^="elevator-"]',
  allTimers: '[data-testid^="elevator-timer-"]',
  movingElevators: '[data-testid^="elevator-"][data-status="moving"]',
};

export type ButtonStatus = 'idle' | 'waiting' | 'arrived';
export type ElevatorStatus = 'idle' | 'moving' | 'arrived';

export const helpers = {
  callElevatorToFloor: (floorNumber: number) => {
    cy.get(selectors.callButton(floorNumber)).click();
  },

  verifyButtonStatus: (floorNumber: number, status: ButtonStatus) => {
    cy.get(selectors.callButton(floorNumber))
      .should('have.attr', 'data-status', status);
  },

  waitForButtonStatus: (
    floorNumber: number,
    status: ButtonStatus,
    timeout: number = 30000
  ) => {
    cy.get(selectors.callButton(floorNumber), { timeout })
      .should('have.attr', 'data-status', status);
  },

  verifyElevatorStatus: (elevatorId: number, status: ElevatorStatus) => {
    cy.get(selectors.elevator(elevatorId))
      .should('have.attr', 'data-status', status);
  },

  waitForElevatorStatus: (
    elevatorId: number,
    status: ElevatorStatus,
    timeout: number = 30000
  ) => {
    cy.get(selectors.elevator(elevatorId), { timeout })
      .should('have.attr', 'data-status', status);
  },

  verifyButtonCSS: (
    floorNumber: number,
    backgroundColor: string,
    text: string
  ) => {
    cy.get(selectors.callButton(floorNumber))
      .should('have.css', 'background-color', backgroundColor)
      .and('contain.text', text);
  },

  callMultipleFloors: (floors: number[]) => {
    floors.forEach(floor => helpers.callElevatorToFloor(floor));
  },

  verifyMultipleButtonsStatus: (floors: number[], status: ButtonStatus) => {
    floors.forEach(floor => helpers.verifyButtonStatus(floor, status));
  },

  waitForMultipleButtonsStatus: (
    floors: number[],
    status: ButtonStatus,
    timeout: number = 35000
  ) => {
    floors.forEach(floor => {
      cy.get(selectors.callButton(floor), { timeout })
        .should('have.attr', 'data-status', status);
    });
  },
};

export const constants = {
  TOTAL_FLOORS: 10,
  TOTAL_ELEVATORS: 5,
  DEFAULT_TIMEOUT: 30000,
  ARRIVAL_HOLD_TIME: 2000,
  MS_PER_FLOOR: 500,
  
  colors: {
    idle: 'rgb(46, 204, 113)',
    waiting: 'rgb(231, 76, 60)',
    arrived: 'rgb(46, 204, 113)',
  },
  
  buttonText: {
    idle: 'Call',
    waiting: 'Waiting',
    arrived: 'Arrived',
  },
};

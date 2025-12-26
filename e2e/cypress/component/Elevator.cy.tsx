import { Elevator } from '@/components/Elevator';
import type { Elevator as ElevatorType } from '@/store/types';

describe('Elevator Component', () => {
  it('should render idle elevator correctly', () => {
    const mockElevator: ElevatorType = {
      id: 1,
      floor: 5,
      status: 'idle',
      direction: 'idle',
      revision: 0,
    };

    cy.mount(<Elevator elevator={mockElevator} />);
    cy.get('[data-testid="elevator-1"]')
      .should('exist')
      .and('have.attr', 'data-status', 'idle');
  });

  it('should render moving elevator with correct status', () => {
    const movingElevator: ElevatorType = {
      id: 2,
      floor: 3,
      status: 'moving',
      direction: 'up',
      destinations: [7, 9],
      startTime: Date.now(),
      startFloor: 3,
      currentTarget: 7,
      revision: 1,
    };

    cy.mount(<Elevator elevator={movingElevator} />);
    cy.get('[data-testid="elevator-2"]')
      .should('have.attr', 'data-status', 'moving');
  });

  it('should render arrived elevator with correct status', () => {
    const arrivedElevator: ElevatorType = {
      id: 3,
      floor: 8,
      status: 'arrived',
      direction: 'idle',
      arrivalTime: Date.now(),
      destinations: [],
      revision: 2,
    };

    cy.mount(<Elevator elevator={arrivedElevator} />);
    cy.get('[data-testid="elevator-3"]')
      .should('have.attr', 'data-status', 'arrived');
  });

  it('should display elevator icon', () => {
    const mockElevator: ElevatorType = {
      id: 1,
      floor: 5,
      status: 'idle',
      direction: 'idle',
      revision: 0,
    };

    cy.mount(<Elevator elevator={mockElevator} />);
    cy.get('[data-testid="elevator-1"]').find('svg').should('exist');
  });
});

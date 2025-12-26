import { ElevatorVisual } from '@/components/ElevatorVisual';
import type { Elevator } from '@/store/types';

describe('ElevatorVisual Component', () => {
  it('should render elevator at correct position', () => {
    const mockElevator: Elevator = {
      id: 1,
      floor: 5,
      status: 'idle',
      direction: 'idle',
      revision: 0,
    };

    cy.mount(
      <ElevatorVisual
        elevator={mockElevator}
        msPerFloor={500}
        elevatorIndex={0}
        totalElevators={5}
        className="test-class"
      />
    );

    cy.get('[data-testid="elevator-1"]').should('exist');
  });

  it('should render moving elevator', () => {
    const mockElevator: Elevator = {
      id: 2,
      floor: 3,
      status: 'moving',
      direction: 'up',
      destinations: [7],
      startTime: Date.now(),
      startFloor: 3,
      currentTarget: 7,
      revision: 1,
    };

    cy.mount(
      <ElevatorVisual
        elevator={mockElevator}
        msPerFloor={500}
        elevatorIndex={1}
        totalElevators={5}
        className="test-class"
      />
    );

    cy.get('[data-testid="elevator-2"]')
      .should('exist')
      .and('have.attr', 'data-status', 'moving');
  });

  it('should render arrived elevator', () => {
    const mockElevator: Elevator = {
      id: 3,
      floor: 8,
      status: 'arrived',
      direction: 'idle',
      arrivalTime: Date.now(),
      destinations: [],
      revision: 2,
    };

    cy.mount(
      <ElevatorVisual
        elevator={mockElevator}
        msPerFloor={500}
        elevatorIndex={2}
        totalElevators={5}
        className="test-class"
      />
    );

    cy.get('[data-testid="elevator-3"]')
      .should('exist')
      .and('have.attr', 'data-status', 'arrived');
  });
});

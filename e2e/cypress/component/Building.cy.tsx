import { Building } from '@/components/Building';
import type { Elevator, FloorStatus } from '@/store/types';

describe('Building Component', () => {
  const mockElevators: Elevator[] = [
    {
      id: 0,
      floor: 0,
      status: 'idle',
      direction: 'idle',
      revision: 0,
    },
    {
      id: 1,
      floor: 5,
      status: 'moving',
      direction: 'up',
      destinations: [7],
      startTime: Date.now(),
      startFloor: 5,
      currentTarget: 7,
      revision: 1,
    },
  ];

  const mockFloors: Record<number, FloorStatus> = {
    0: 'idle',
    5: 'waiting',
    7: 'arrived',
  };

  it('should render building with correct number of floors', () => {
    const onCall = cy.stub();
    
    cy.mount(
      <Building
        numFloors={10}
        elevators={mockElevators}
        floors={mockFloors}
        onCall={onCall}
        msPerFloor={500}
        arrivalDelay={2000}
      />
    );

    cy.get('[data-testid="building"]').should('exist');
    cy.get('[data-testid^="floor-"]').should('have.length', 10);
  });

  it('should display floors in descending order', () => {
    const onCall = cy.stub();
    
    cy.mount(
      <Building
        numFloors={5}
        elevators={mockElevators}
        floors={mockFloors}
        onCall={onCall}
        msPerFloor={500}
        arrivalDelay={2000}
      />
    );

    cy.get('[data-testid^="floor-"]').first().should('have.attr', 'data-testid', 'floor-4');
    cy.get('[data-testid^="floor-"]').last().should('have.attr', 'data-testid', 'floor-0');
  });

  it('should render all elevators', () => {
    const onCall = cy.stub();
    
    cy.mount(
      <Building
        numFloors={10}
        elevators={mockElevators}
        floors={mockFloors}
        onCall={onCall}
        msPerFloor={500}
        arrivalDelay={2000}
      />
    );

    cy.get('[data-testid="elevator-0"]').should('exist');
    cy.get('[data-testid="elevator-1"]').should('exist');
  });

  it('should pass onCall to floor buttons', () => {
    const onCall = cy.stub();
    
    cy.mount(
      <Building
        numFloors={5}
        elevators={mockElevators}
        floors={mockFloors}
        onCall={onCall}
        msPerFloor={500}
        arrivalDelay={2000}
      />
    );

    cy.get('[data-testid="call-button-0"]').click().then(() => {
      expect(onCall).to.be.calledWith(0);
    });
  });
});

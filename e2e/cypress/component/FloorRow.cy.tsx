import { FloorRow } from '@/components/FloorRow';
import type { Elevator } from '@/store/types';
import styles from '@/components/Building/index.module.scss';

describe('FloorRow Component', () => {
  const mockElevators: Elevator[] = [
    {
      id: 0,
      floor: 5,
      status: 'idle',
      direction: 'idle',
      revision: 0,
    },
    {
      id: 1,
      floor: 3,
      status: 'moving',
      direction: 'up',
      destinations: [5, 7],
      startTime: Date.now(),
      startFloor: 3,
      currentTarget: 5,
      revision: 1,
    },
  ];

  it('should render floor label correctly', () => {
    const onCall = cy.stub();

    cy.mount(
      <FloorRow
        floorNumber={5}
        floorName="5th"
        elevators={mockElevators}
        floorStatus="idle"
        msPerFloor={500}
        arrivalDelay={2000}
        onCall={onCall}
        isSourceFloor={false}
        styles={styles}
      />
    );

    cy.get('[data-testid="floor-5"]').should('exist');
    cy.contains('5th').should('exist');
  });

  it('should render call button with correct status', () => {
    const onCall = cy.stub();

    cy.mount(
      <FloorRow
        floorNumber={5}
        floorName="5th"
        elevators={mockElevators}
        floorStatus="idle"
        msPerFloor={500}
        arrivalDelay={2000}
        onCall={onCall}
        isSourceFloor={false}
        styles={styles}
      />
    );

    cy.get('[data-testid="call-button-5"]')
      .should('exist')
      .and('have.attr', 'data-status', 'idle');
  });

  it('should display elevator when on this floor', () => {
    const onCall = cy.stub();

    cy.mount(
      <FloorRow
        floorNumber={5}
        floorName="5th"
        elevators={mockElevators}
        floorStatus="idle"
        msPerFloor={500}
        arrivalDelay={2000}
        onCall={onCall}
        isSourceFloor={false}
        styles={styles}
      />
    );

    cy.get('[data-testid="elevator-0"]').should('exist');
  });

  it('should not display elevator when not on this floor', () => {
    const onCall = cy.stub();

    cy.mount(
      <FloorRow
        floorNumber={7}
        floorName="7th"
        elevators={mockElevators}
        floorStatus="idle"
        msPerFloor={500}
        arrivalDelay={2000}
        onCall={onCall}
        isSourceFloor={false}
        styles={styles}
      />
    );

    cy.get('[data-testid="elevator-0"]').should('not.exist');
  });

  it('should call onCall when floor button is clicked', () => {
    const onCall = cy.stub();

    cy.mount(
      <FloorRow
        floorNumber={8}
        floorName="8th"
        elevators={mockElevators}
        floorStatus="idle"
        msPerFloor={500}
        arrivalDelay={2000}
        onCall={onCall}
        isSourceFloor={false}
        styles={styles}
      />
    );

    cy.get('[data-testid="call-button-8"]').click().then(() => {
      expect(onCall).to.be.calledWith(8);
    });
  });

  it('should render waiting status correctly', () => {
    const onCall = cy.stub();

    cy.mount(
      <FloorRow
        floorNumber={5}
        floorName="5th"
        elevators={mockElevators}
        floorStatus="waiting"
        msPerFloor={500}
        arrivalDelay={2000}
        onCall={onCall}
        isSourceFloor={false}
        styles={styles}
      />
    );

    cy.get('[data-testid="call-button-5"]')
      .should('have.attr', 'data-status', 'waiting')
      .and('be.disabled');
  });
});

import { Timer } from '@/components/Timer';

describe('Timer Component', () => {
  it('should display seconds countdown for short durations', () => {
    const calculateTime = () => 5000;
    
    cy.mount(
      <Timer 
        elevatorId={1} 
        targetFloor={5} 
        calculateTime={calculateTime}
        uniqueKey="test-key-1"
      />
    );
    
    cy.get('[data-testid="elevator-timer-1"]')
      .should('exist')
      .and('contain', '5')
      .and('contain', 'Sec.');
  });

  it('should display minutes and seconds for long durations', () => {
    const calculateTime = () => 75000;
    
    cy.mount(
      <Timer 
        elevatorId={2} 
        targetFloor={8} 
        calculateTime={calculateTime}
        uniqueKey="test-key-2"
      />
    );
    
    cy.get('[data-testid="elevator-timer-2"]')
      .should('contain', 'min')
      .and('contain', 'sec.');
  });

  it('should not render when time is zero', () => {
    const calculateTime = () => 0;
    
    cy.mount(
      <Timer 
        elevatorId={3} 
        targetFloor={5} 
        calculateTime={calculateTime}
        uniqueKey="test-key-3"
      />
    );
    
    cy.get('[data-testid="elevator-timer-3"]').should('not.exist');
  });

  it('should not render when time is negative', () => {
    const calculateTime = () => -1000;
    
    cy.mount(
      <Timer 
        elevatorId={4} 
        targetFloor={7} 
        calculateTime={calculateTime}
        uniqueKey="test-key-4"
      />
    );
    
    cy.get('[data-testid="elevator-timer-4"]').should('not.exist');
  });

  it('should update when uniqueKey changes', () => {
    const calculateTime1 = () => 3000;
    const calculateTime2 = () => 7000;
    
    cy.mount(
      <Timer 
        elevatorId={5} 
        targetFloor={6} 
        calculateTime={calculateTime1}
        uniqueKey="test-key-5a"
      />
    );
    
    cy.get('[data-testid="elevator-timer-5"]').should('contain', '3');
    
    cy.mount(
      <Timer 
        elevatorId={5} 
        targetFloor={6} 
        calculateTime={calculateTime2}
        uniqueKey="test-key-5b"
      />
    );
    
    cy.get('[data-testid="elevator-timer-5"]').should('contain', '7');
  });
});

import { Floor } from '@/components/Floor';

describe('Floor Component', () => {
  it('should render idle state with correct text and enabled button', () => {
    const onCall = cy.stub();
    cy.mount(<Floor floorNumber={5} status="idle" onCall={onCall} />);
    
    cy.get('[data-testid="call-button-5"]')
      .should('exist')
      .and('not.be.disabled')
      .and('contain.text', 'Call')
      .and('have.attr', 'data-status', 'idle');
  });

  it('should call onCall with correct floor number when clicked', () => {
    const onCall = cy.stub();
    cy.mount(<Floor floorNumber={7} status="idle" onCall={onCall} />);
    
    cy.get('[data-testid="call-button-7"]')
      .click()
      .then(() => {
        expect(onCall).to.be.calledWith(7);
        expect(onCall).to.be.calledOnce;
      });
  });

  it('should show waiting state and disable button', () => {
    const onCall = cy.stub();
    cy.mount(<Floor floorNumber={3} status="waiting" onCall={onCall} />);
    
    cy.get('[data-testid="call-button-3"]')
      .should('be.disabled')
      .and('contain.text', 'Waiting')
      .and('have.attr', 'data-status', 'waiting');
  });

  it('should show arrived state and disable button', () => {
    const onCall = cy.stub();
    cy.mount(<Floor floorNumber={9} status="arrived" onCall={onCall} />);
    
    cy.get('[data-testid="call-button-9"]')
      .should('be.disabled')
      .and('contain.text', 'Arrived')
      .and('have.attr', 'data-status', 'arrived');
  });

  it('should have correct aria-label for accessibility', () => {
    const onCall = cy.stub();
    cy.mount(<Floor floorNumber={4} status="idle" onCall={onCall} />);
    
    cy.get('[data-testid="call-button-4"]')
      .should('have.attr', 'aria-label', 'Call elevator to floor 4');
  });

  it('should not call onCall when button is disabled', () => {
    const onCall = cy.stub();
    cy.mount(<Floor floorNumber={5} status="waiting" onCall={onCall} />);
    
    cy.get('[data-testid="call-button-5"]')
      .should('be.disabled')
      .then(() => {
        expect(onCall).not.to.be.called;
      });
  });
});

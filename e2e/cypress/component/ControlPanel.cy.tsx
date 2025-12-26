import { ControlPanel } from '@/components/ControlPanel';

describe('ControlPanel Component', () => {
  it('should render all controls with correct initial values', () => {
    const mockHandlers = {
      onFloorsChange: cy.stub(),
      onElevatorsChange: cy.stub(),
      onReset: cy.stub(),
    };

    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={5}
        queueLength={3}
        {...mockHandlers}
      />
    );

    cy.get('#floors').should('have.value', '10');
    cy.get('#elevators').should('have.value', '5');
  });

  it('should increment floors when + button is clicked', () => {
    const onFloorsChange = cy.stub();

    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={5}
        queueLength={0}
        onFloorsChange={onFloorsChange}
        onElevatorsChange={cy.stub()}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Increase floors"]').click().then(() => {
      expect(onFloorsChange).to.be.calledWith(11);
    });
  });

  it('should decrement floors when - button is clicked', () => {
    const onFloorsChange = cy.stub();

    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={5}
        queueLength={0}
        onFloorsChange={onFloorsChange}
        onElevatorsChange={cy.stub()}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Decrease floors"]').click().then(() => {
      expect(onFloorsChange).to.be.calledWith(9);
    });
  });

  it('should disable - button when at minimum floors', () => {
    cy.mount(
      <ControlPanel
        numFloors={2}
        numElevators={5}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={cy.stub()}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Decrease floors"]').should('be.disabled');
  });

  it('should disable + button when at maximum floors', () => {
    cy.mount(
      <ControlPanel
        numFloors={20}
        numElevators={5}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={cy.stub()}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Increase floors"]').should('be.disabled');
  });

  it('should increment elevators when + button is clicked', () => {
    const onElevatorsChange = cy.stub();

    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={5}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={onElevatorsChange}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Increase elevators"]').click().then(() => {
      expect(onElevatorsChange).to.be.calledWith(6);
    });
  });

  it('should decrement elevators when - button is clicked', () => {
    const onElevatorsChange = cy.stub();

    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={5}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={onElevatorsChange}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Decrease elevators"]').click().then(() => {
      expect(onElevatorsChange).to.be.calledWith(4);
    });
  });

  it('should disable - button when at minimum elevators', () => {
    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={1}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={cy.stub()}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Decrease elevators"]').should('be.disabled');
  });

  it('should disable + button when at maximum elevators', () => {
    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={10}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={cy.stub()}
        onReset={cy.stub()}
      />
    );

    cy.get('[aria-label="Increase elevators"]').should('be.disabled');
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = cy.stub();

    cy.mount(
      <ControlPanel
        numFloors={10}
        numElevators={5}
        queueLength={0}
        onFloorsChange={cy.stub()}
        onElevatorsChange={cy.stub()}
        onReset={onReset}
      />
    );

    cy.contains('button', 'Reset').click().then(() => {
      expect(onReset).to.be.calledOnce;
    });
  });
});

import { useState } from 'react';
import { Building } from '@/components/Building';
import { ControlPanel } from '@/components/ControlPanel';
import { Footer } from '@/components/Footer';
import { AppProvider } from '@/providers/AppProvider';
import { useElevatorSystem } from '@/hooks/useElevatorSystem';
import styles from './App.module.scss';

function App() {
  const [numFloors, setNumFloors] = useState(10);
  const [numElevators, setNumElevators] = useState(5);

  const {
    elevators,
    floors,
    queueLength,
    movingElevators,
    idleElevators,
    arrivedElevators,
    totalCallsServed,
    avgWaitTime,
    config,
    call,
    reset,
  } = useElevatorSystem(numFloors, numElevators);

  return (
    <AppProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Elevator System - Arbox Exercise</h1>
        </header>

        <main className={styles.main}>
          <div className={styles.sidebar}>
            <ControlPanel
              numFloors={numFloors}
              numElevators={numElevators}
              onFloorsChange={setNumFloors}
              onElevatorsChange={setNumElevators}
              onReset={reset}
              queueLength={queueLength}
            />
          </div>

          <Building
            numFloors={numFloors}
            elevators={elevators}
            floors={floors}
            onCall={call}
            msPerFloor={config.msPerFloor}
            arrivalDelay={config.arrivalDelay}
          />
        </main>

        <Footer 
          queueLength={queueLength} 
          movingElevators={movingElevators}
          idleElevators={idleElevators}
          arrivedElevators={arrivedElevators}
          totalCallsServed={totalCallsServed}
          avgWaitTime={avgWaitTime}
        />
      </div>
    </AppProvider>
  );
}

export default App;

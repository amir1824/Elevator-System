import { FC, memo } from 'react';
import clsx from 'clsx';
import { ElevatorIcon } from '@/components/Icons';
import type { Elevator as ElevatorType } from '@/store/types';
import styles from './index.module.scss';

interface ElevatorProps {
    elevator: ElevatorType;
}

export const Elevator: FC<ElevatorProps> = memo(({ elevator }) => {
    return (
        <div 
            className={clsx(styles.elevator, styles[elevator.status])}
            data-testid={`elevator-${elevator.id}`}
            data-status={elevator.status}
        >
            <ElevatorIcon />
        </div>
    );
});

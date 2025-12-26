import { FC, useState, useEffect } from 'react';
import { Elevator } from '@/components/Elevator';
import type { Elevator as ElevatorType } from '@/store/types';

interface ElevatorVisualProps {
    elevator: ElevatorType;
    msPerFloor: number;
    elevatorIndex: number;
    totalElevators: number;
    className?: string;
}

export const ElevatorVisual: FC<ElevatorVisualProps> = ({
    elevator,
    msPerFloor,
    elevatorIndex,
    totalElevators,
    className = ''
}) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (elevator.status !== 'moving') {
            setOffset(0);
            return;
        }

        let rafId: number;
        const animate = () => {
            const elapsed = Date.now() - elevator.startTime;
            const totalTime = Math.abs(elevator.currentTarget - elevator.floor) * msPerFloor;
            const progress = Math.min(elapsed / totalTime, 1);
            setOffset((elevator.floor - elevator.currentTarget) * progress);
            
            if (progress < 1) rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [elevator, msPerFloor]);

    const leftPosition = `calc(${elevatorIndex} * (${totalElevators > 0 ? 100 / totalElevators : 0}%) + 50% / ${totalElevators})`;

    return (
        <div
            className={className}
            style={{
                '--offset': offset,
                left: leftPosition
            } as React.CSSProperties}
        >
            <Elevator elevator={elevator} />
        </div>
    );
};

import React from 'react';
import ElevatorSvg from '@/assets/icons/elevator.svg?react';

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const ElevatorIcon: React.FC<IconProps> = ({
  className,
  color,
  size
}) => {
  return (
    <ElevatorSvg 
      className={className}
      style={{ 
        width: size, 
        height: size, 
        color: color,
        fill: 'currentColor'
      }} 
    />
  );
};

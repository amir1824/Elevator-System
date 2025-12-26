export const addDestination = (destinations: number[], newFloor: number): number[] => {
    if (destinations.includes(newFloor)) return destinations;
    return [...destinations, newFloor];
};

export const removeDestination = (destinations: number[], floor: number): number[] => {
    return destinations.filter(f => f !== floor);
};

export const sortDestinationsLOOK = (
    destinations: number[],
    currentFloor: number,
    direction: 'up' | 'down'
): number[] => {
    if (destinations.length === 0) return [];
    
    const unique = [...new Set(destinations)];
    
    const ahead: number[] = [];
    const passed: number[] = [];
    
    unique.forEach(floor => {
        if (direction === 'up') {
            if (floor >= currentFloor) {
                ahead.push(floor);
            } else {
                passed.push(floor);
            }
        } else {
            if (floor <= currentFloor) {
                ahead.push(floor);
            } else {
                passed.push(floor);
            }
        }
    });
    
    const sortedAhead = ahead.sort((a, b) => 
        direction === 'up' ? a - b : b - a
    );
    
    const sortedPassed = passed.sort((a, b) => 
        direction === 'up' ? b - a : a - b
    );
    
    return [...sortedAhead, ...sortedPassed];
};

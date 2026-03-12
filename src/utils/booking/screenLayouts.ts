/* Hur biosalongen ska se ut. Testade runt lite här så declarera jag först sedan exportera ordningen var viktig. Tidigare har vi mest kört
Kört declariononen mitt i exporten*/
export const screenLayouts: Record<string, number[]> = {
  "Stora Salongen": [8, 9, 10, 10, 10, 10, 12, 12],
  "Lilla Salongen": [6, 8, 9, 10, 10, 12],
};

// Stores layout data only, and
// This object defines how many seats each row contains in each cinema salon.
// The numbers represent seats per row from top to bottom.

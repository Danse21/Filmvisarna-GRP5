// Component that shows a legend explaining seat colors
export default function SeatLegendLabel() {
  return (
    // Container for the seat legend
    <div className="seat-legend d-flex flex-column gap-1 mt-3">
      {/* Legend item: free seat */}
      <div className="legend-item">
        <span className="legend-seat seat-free" /> {/* seat color box */}
        <span>Ledig stol</span> {/* label */}
      </div>

      {/* Legend item: occupied seat */}
      <div className="legend-item">
        <span className="legend-seat seat-occupied" /> {/* seat color box */}
        <span>Upptagen stol</span> {/* label */}
      </div>

      {/* Legend item: selected seat */}
      <div className="legend-item">
        <span className="legend-seat seat-selected" /> {/* seat color box */}
        <span>Vald stol</span> {/* label */}
      </div>
    </div>
  );
}

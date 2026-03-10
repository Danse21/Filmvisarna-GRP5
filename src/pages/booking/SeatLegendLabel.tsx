export default function SeatLegendLabel() {
  return (
    <div className="seat-legend d-flex flex-column gap-1 mt-3">
      <div className="legend-item">
        <span className="legend-seat seat-free" />
        <span>Ledig stol</span>
      </div>

      <div className="legend-item">
        <span className="legend-seat seat-occupied" />
        <span>Upptagen stol</span>
      </div>

      <div className="legend-item">
        <span className="legend-seat seat-selected" />
        <span>Vald stol</span>
      </div>
    </div>
  );
}

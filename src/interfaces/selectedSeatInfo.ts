// This type stores the exact selected seat information
// passed from BookingPage through BookingSummaryPage.
export default interface SelectedSeatInfo {
  id: string;
  row: number;
  seatNumber: number;
}

// This is used for selected seat data passed between pages (BookingPage --> BookingSummaryPage --> BookingConfirmationPage)
// Denna innehåller exakt som behövs för att visa valda platser konsekvent.

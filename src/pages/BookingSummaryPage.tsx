import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, CardBody } from "react-bootstrap";
import type Movie from "../interfaces/movie";

import type SelectedSeatInfo from "../interfaces/selectedSeatInfo";
import type Tickets from "../interfaces/ticket";

import SelectedTicketPriceSummary from "./booking/SelectedTicketPriceSummary";
import EmailInputField from "./booking/EmailInputField";
import SelectedMovieAndSeatInfo from "./booking/SelectedMovieAndSeatInfo";

BookingSummaryPage.route = {
  path: "/booking/selected",
  index: 10,
};

// Component start and state handling
// This component renders the Booking Summary page
export default function BookingSummaryPage() {
  // Hook from React Router used to navigate between pages
  const navigate = useNavigate();

  // Hook used to access data passed from the previous page
  const location = useLocation();

  // Read the state object that was sent from BookingPage when navigating here
  const state = location.state as
    | {
      movie: Movie; // The selected movie object
      showtime: { id: number; start_time: string; }; // Showtime information
      screen: { screen_name: string; }; // Cinema screen (salong) information
      selectedSeats: string[]; // Array containing seat ids selected by the user
      selectedSeatInfo: SelectedSeatInfo[]; // Detailed seat information including seat number
      tickets: Tickets; // Object containing number of tickets per category
      totalPrice: number; // Total price for the booking
    }
    | undefined; // State can be undefined if the page is opened directly

  // React state used to store the email address entered by the user
  const [email, setEmail] = useState("");

  // If no state data exists, it means the page was accessed incorrectly
  if (!state) {
    // Show a fallback page instead of crashing
    return (
      <Container className="pt-5">
        {/* Back button that navigates to the previous page */}
        <Button variant="link" onClick={() => navigate(-1)}>
          ← Bakåt
        </Button>

        {/* Message informing the user that booking data is missing */}
        <p>Ingen bokningsdata hittades.</p>
      </Container>
    );
  }

  // Extract the data from the state object for easier use
  const {
    movie, // Selected movie
    showtime, // Showtime data
    screen, // Cinema screen information
    tickets, // Ticket category counts
    totalPrice, // Total booking price
    selectedSeats, // Selected seat ids
    selectedSeatInfo, // Selected seat details including seat numbers
  } = state;

  // This object groups selected seats by row using the exact seat numbers
  // from the booking page seat layout.
  const groupedSeats: Record<number, number[]> = {};

  // Loop through all selected seat info objects.
  selectedSeatInfo.forEach((seat) => {
    // Create an empty array for the row if it does not exist yet.
    if (!groupedSeats[seat.row]) {
      groupedSeats[seat.row] = [];
    }

    // Add the exact seat number to the correct row.
    groupedSeats[seat.row].push(seat.seatNumber);
  });

  // This variable creates the text that shows the selected seats
  // using the exact seat numbers from BookingPage.
  const seatText =
    selectedSeatInfo.length > 0
      ? Object.entries(groupedSeats)
        // Sort rows from lowest to highest row number.
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([row, seats]) => {
          // Sort seat numbers from lowest to highest.
          const sortedSeats = [...seats].sort((a, b) => a - b);

          // Return formatted seat text for one row.
          return `Rad ${row}: stol ${sortedSeats.join(", ")}`;
        })
        // Join all row texts into one string.
        .join(" • ")
      : // Show a dash if no seats are selected.
      "—";

  // This function checks whether the email address has a valid format.
  function isValidEmail(value: string) {
    // This regular expression checks that the email has text before and after @ and .
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // This function sends the booking request to the backend.
  async function confirmBooking() {
    // Stop if the email is empty or invalid.
    if (!isValidEmail(email)) {
      alert("En giltig e-postadress krävs för att slutföra bokningen.");
      return;
    }

    // Send the booking request to the backend.
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        showtime_id: showtime.id,
        email,
        seats: selectedSeats,
        tickets,
        total_price: totalPrice,
      }),
    });

    // Convert the server response to JSON.
    const data = await response.json();

    // If the booking succeeds, navigate to the confirmation page.
    if (response.ok) {
      navigate("/booking/confirmation", {
        state: {
          bookingId: data.booking_id,
          bookingReference: data.booking_reference,
          movie,
          showtime,
          screen,
          selectedSeats,
          selectedSeatInfo,
          tickets,
          totalPrice,
          email,
        },
      });
    } else {
      // Show an error message if the booking fails.
      alert(
        data.error
          ? `${data.error}: ${data.message ?? ""}`
          : "Bokningen misslyckades.",
      );
    }
  }

  // JSX layout (the page structure)
  return (
    // Main Bootstrap container for the booking summary page
    <Container className="booking-summary-page pt-header pb-5">
      <Card className="booking-summary-card border-0">

        {/* First section containing ticket summary and email input */}
        <Row className="booking-section">
          {/* Left column showing selected ticket types and prices */}
          <Col md={6}>
            <Card className="booking-summary-inner-card border-0">

              {/* Component that displays ticket categories and total price */}
              <SelectedTicketPriceSummary
                tickets={tickets} // Pass ticket counts to the component
                totalPrice={totalPrice} // Pass total booking price
              />
            </Card>
          </Col>

          {/* Right column containing the email input field */}
          <Col md={5}>
            {/* Component that renders the email label and input field */}
            <EmailInputField
              email={email} // Current email value
              onChangeEmail={setEmail} // Function used to update the email state
            />
          </Col>
        </Row>

        <Card className="booking-summary-inner-card border-0">
          {/* Component showing movie information and selected seats */}
          <SelectedMovieAndSeatInfo
            movie={movie} // Pass movie data
            showtime={showtime} // Pass showtime data
            screen={screen} // Pass cinema screen information
            seatText={seatText} // Pass formatted seat description text
          />
        </Card>

        {/* Section containing the confirm booking button */}
        <div className="booking-section text-center">
          {/* Button used to confirm the booking */}
          <Button
            className="confirm-booking-btn shadow"
            onClick={confirmBooking} // Function executed when the button is clicked
          >
            Bekräfta bokning
          </Button>
        </div>
      </Card>
    </Container>
  );
}

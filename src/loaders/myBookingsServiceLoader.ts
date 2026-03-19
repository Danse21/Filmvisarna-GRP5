import { redirect } from "react-router-dom";
import type BookingItems from "../interfaces/bookingItems";

// Loader that fetches bookings for the logged-in user.
//
// Notes:
// - Email/user id is NOT sent from the frontend.
// - Backend identifies the user using the session.
// - If no session exists, backend returns 401.
export default async function myBookingsServiceLoader(): Promise<{
  bookings: BookingItems[];
}> {
  // Request the user's bookings from the backend
  const response = await fetch("/api/my-bookings", {
    method: "GET", // HTTP method
    headers: {
      "Content-Type": "application/json", // response expected as JSON
    },
  });

  // If the backend returns 401, the user is not logged in
  // Redirect the user back to the menu page
  if (response.status === 401) {
    throw redirect("/menu");
  }

  // Handle other backend errors (500, 404, etc.)
  // This will trigger the route error boundary
  if (!response.ok) {
    throw new Response("Kunde inte hämta bokningar.", {
      status: response.status,
    });
  }

  // Parse the JSON response into BookingItems objects
  const bookings: BookingItems[] = await response.json();

  // Return the bookings to the page that uses this loader
  return {
    bookings,
  };
}

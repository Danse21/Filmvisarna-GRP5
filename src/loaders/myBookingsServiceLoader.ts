import { redirect } from "react-router-dom";
import type BookingItems from "../interfaces/bookingItems";

// This loader fetches bookings for the currently logged-in user.
// - The backend identifies the user from session.
// - If no user is logged in, the backend returns 401.
// - In that case, we redirect the visitor away from Mina bokningar.
export default async function myBookingsServiceLoader(): Promise<{
  bookings: BookingItems[];
}> {
  const response = await fetch("/api/my-bookings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // If the user is not logged in,
  // send them back to the menu page.
  if (response.status === 401) {
    throw redirect("/menu");
  }

  // Throw a normal route error for other backend failures.
  if (!response.ok) {
    throw new Response("Kunde inte hämta bokningar.", {
      status: response.status,
    });
  }

  const bookings: BookingItems[] = await response.json();

  return {
    bookings,
  };
}

import type BookingItems from "../interfaces/bookingItems";

export default async function myBookingsServiceLoader({
  request,
}: any): Promise<{
  bookings: BookingItems[];
}> {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return {
      bookings: [],
    };
  }

  const response = await fetch(
    `/api/my-bookings?email=${encodeURIComponent(email)}`,
  );

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

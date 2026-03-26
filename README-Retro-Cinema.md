## README-fil

#### Vilka har arbetat i projektet och vad heter ni på Git?

Projekt team medlemmar:

1. Muhamed Hajra
2. Ha Viet Kok
3. Damasus C. Okeke
4. Oliver Apelqvist

GitHub namn: https://github.com/Danse21/Filmvisarna-GRP5

### Kortfattad projektbeskrivning

Retro Cinema is a fullstack web application for browsing films, viewing showtimes, booking cinema seats, receiving a booking confirmation by email, Registering/Logging in as a member, and viewing personal booking history as well as cancelling an existing booking. The project consists of a React frontend, a C# Minimal API backend, and a MySQL database. The design follows a client-server model where the frontend handles presentation and user interaction interafce, while the backend handles validation, business logic, databse access queries, and email sending.

---

    Frontend part includes:
      - React
      - TypeScript
      - SCSS
      - React Bootstrap
      - React Router

    Backend part includes:
      - C# Minimal API
      - MySqlconnector (and queries)
      - MailKit / MimeKit
      - QRCoder

    Database:
    - MySQL

    Other concepts used:
    - Session-based authentication
    - ACL-based route control
    - Email generation with QR code
    - Route loaders for page data fetching in React Router

    Important frontend files include route pages such as;
    - StartPage.tsx
    - MenuPage.tsx
    - BookingPage.tsx
    - BookingSummaryPage.tsx
    - BookingConfirmationPage.tsx
    - CancelBookingPage.tsx
    - MyBookingsPage.tsx (not yet fully impelemented)

    Important backend files;
    - BookingRoutes.cs
    - BookingService.cs
    - CancelBookingRoutes.cs
    - LoginRoutes.cs
    - Session.cs (inherited from Thomas)
    - Acl.cs (inherited from Thomas and modified)
    - EmailService.cs
    - BookingEmailBuilder.cs.

---

### App main features

- Browse current and upcoming films
- Open film details and view showtimes
- Select seats for a specific showtime
- Select ticket categories and calculate total price
- Confirm booking with email address
- Receive booking confirmation email with booking reference and QR code
- Register and log in as a user
- View “My Bookings” when logged in (not yet fully impelemented)
- Cancel an existing booking with email and booking reference

### Installation, inkl databashantering/uppsättning

- Nödvändiga inställningar och “hemligheter” (t.ex. connection strings) som behövs för att kunna starta applikationen, t.ex. i form av en environment-fil eller db-settings.json.
- Användarnamn och lösenord för en användare med admin-rättigheter (om ni har ett admin-UX/backoffice).
- Annat som kan vara viktigt att veta

## Dokumentation över:

- Teknisk skuld
- Lösningsarkitektur
- Planerat men ej genomfört arbete

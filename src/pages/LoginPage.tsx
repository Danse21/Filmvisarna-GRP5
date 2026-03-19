// Import React hook for local state.
// We use state to store form input, loading state, and error messages.
// Import layout and form components from React Bootstrap.
// Import navigation hook from React Router.
// This lets us move the user to another page after successful login.
// Import navigation hook from React Router.
// This lets us move the user to another page after successful login.
// // Import the registration form component.
// This is rendered below the login form on the same page.
// // Import the registration form component.
// This is rendered below the login form on the same page.
import { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../parts/RegisterForm";
import { useUserContext } from "../hooks/userContext";

// Route configuration used by the app router.
LoginPage.route = {
  path: "/login",
  loginLabel: "Login",
  index: 18,
};

// This component renders the login page.
export default function LoginPage() {
  // Used to navigate between pages after successful login or when closing the page.
  const navigate = useNavigate();

  // Viktigt denna ändrar user vid lyckad login.
  const [, setUser] = useUserContext();

  // Store the email entered by the user.
  const [email, setEmail] = useState("");

  // Store the password entered by the user.
  const [password, setPassword] = useState("");

  // Store an error message if login fails.
  const [errorMessage, setErrorMessage] = useState("");

  // Track whether the login request is currently in progress.
  // This is useful for disabling the button and showing loading text.
  const [isLoading, setIsLoading] = useState(false);

  // Runs when the login form is submitted.
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page on form submit.
    event.preventDefault();

    // Clear any previous error before starting a new login attempt.
    setErrorMessage("");

    // Frontend validation: email is required.
    if (!email.trim()) {
      setErrorMessage("Fyll i din e-postadress.");
      return;
    }

    // Frontend validation: password is required.
    if (!password) {
      setErrorMessage("Fyll i ditt lösenord.");
      return;
    }

    // Start loading state before sending request.
    setIsLoading(true);

    try {
      // Send login request to backend.
      // The backend will:
      // 1. look up the user by email
      // 2. compare the entered password with the stored password/hash
      // 3. save the user in session if login succeeds
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      // Convert backend response to JSON so we can read success or error data.
      const data = await response.json();

      // If the request failed or backend returned an application error,
      // show a readable error message to the user.
      if (!response.ok || data?.error) {
        setErrorMessage(data?.error ?? "Kunde inte logga in.");
        return;
      }

      // Nytt:
      // När login lyckas sparar vi användaren i global context
      // så resten av appen direkt vet att någon är inloggad.
      setUser({
        id: data.id ?? null,
        firstName: data.firstName ?? "",
        email: data.email ?? email.trim(),
        isLoggedIn: true,
      });

      // If login succeeds, navigate to the menu page.
      // The menu loader can now detect that the user is logged in.
      navigate("/menu");
    } catch {
      // Handle unexpected network or server errors.
      setErrorMessage("Något gick fel vid inloggning.");
    } finally {
      // Stop loading state whether login succeeded or failed.
      setIsLoading(false);
    }
  }

  return (
    <Container className="pt-5 pb-5" style={{ maxWidth: "420px" }}>
      {/*
        Close button.
        Sends the user back to the start page without logging in.
      */}
      <button
        type="button"
        className="btn btn-link text-dark ps-0 text-decoration-none fw-bold mb-4 mt-5"
        onClick={() => navigate("/")}
        aria-label="Close login page"
      >
        ✕ STÄNG
      </button>

      {/* Login section */}
      <section className="mb-5 text-center">
        <h2 className="mb-4">Logga in!</h2>

        {/*
          Login form.
          When submitted, it calls handleLogin.
        */}
        <Form onSubmit={handleLogin}>
          {/* Email input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="E-post"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          {/* Password input */}
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Lösenord"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>

          {/* Show validation error or backend error */}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            className="btn-continue w-100"
            disabled={isLoading}
          >
            {isLoading ? "Loggar in..." : "Fortsätt"}
          </Button>
        </Form>
      </section>

      {/* Registration section shown below the login form */}
      <RegisterForm />
    </Container>
  );
}

// Nu fungerar flödet så här:

// Besökare

// öppnar "/menu"

// currentUserLoader kör GET /api/login

// backend svarar med { error: "No user is logged in." }

// isLoggedIn = false

// länken Mina Bokningar visas inte

// Inloggad användare

// loggar in via LoginPage

// backend sparar användaren i session

// Nytt:
// LoginPage sparar också användaren i userContext direkt

// användaren skickas till "/menu"

// currentUserLoader kör GET /api/login

// backend returnerar user-objekt

// isLoggedIn = true

// länken Mina Bokningar visas

// Import React hook for local component state.
import { useState } from "react";

// Import Bootstrap components used for the form and success modal.
import { Button, Form, Modal } from "react-bootstrap";

// This component renders the registration form.
// It collects user information and sends it to the backend to create a new user.
export default function RegisterForm() {
  // Store all input field values in one object.
  // This makes it easier to manage the whole form in a single state variable.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Store an error message to show validation or backend errors.
  const [errorMessage, setErrorMessage] = useState("");

  // Controls whether the success modal is visible after successful registration.
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Tracks whether the registration request is currently running.
  const [isLoading, setIsLoading] = useState(false);

  // Handle changes in any input field.
  // The "name" attribute on each input tells us which property to update.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    // Keep all existing field values,
    // then update only the field that changed.
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Runs when the registration form is submitted.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page.
    event.preventDefault();

    // Clear previous error before trying again.
    setErrorMessage("");

    // Validate first name and last name.
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Fyll i både förnamn och efternamn.");
      return;
    }

    // Validate email.
    if (!formData.email.trim()) {
      setErrorMessage("Fyll i en e-postadress.");
      return;
    }

    // Validate password.
    if (!formData.password) {
      setErrorMessage("Fyll i ett lösenord.");
      return;
    }

    // Validate password confirmation.
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Lösenorden matchar inte.");
      return;
    }

    // Start loading state before sending request.
    setIsLoading(true);

    try {
      // Send registration request to backend.
      // Important:
      // The frontend sends the exact password entered by the user.
      // The backend should then hash that password and store the hash in the database.
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      // Parse backend response.
      const data = await response.json();

      // If backend returns an error or HTTP status is not OK,
      // show a user-friendly error message.
      if (!response.ok || data.error) {
        setErrorMessage(data.error ?? "Kunde inte skapa användaren.");
        return;
      }

      // Reset form fields after successful registration.
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Show success popup.
      setShowSuccessModal(true);
    } catch {
      // Handle unexpected network/server errors.
      setErrorMessage("Något gick fel när kontot skulle skapas.");
    } finally {
      // Stop loading state whether registration succeeded or failed.
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Registration section */}
      <section className="text-center">
        <h3 className="mb-4">Bli medlem!</h3>

        {/* Registration form */}
        <Form onSubmit={handleSubmit}>
          {/* First name input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Förnamn"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Last name input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Efternamn"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Email input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="E-post"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Password input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Lösenord"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Confirm password input */}
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Bekräfta lösenord"
              className="bg-dark bg-opacity-25 border-dark text-center"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Show validation or backend errors */}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            className="btn-continue w-100"
            disabled={isLoading}
          >
            {isLoading ? "Skapar konto..." : "Fortsätt"}
          </Button>
        </Form>
      </section>

      {/* Success modal shown after successful registration */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konto skapat</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Din användare skapades. Du kan logga in nu om du vill.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Okej
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

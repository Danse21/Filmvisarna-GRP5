import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function RegisterForm() {
  // useState stores values between renders.
  // Here we keep all form fields together in one object.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Stores any error message we want to show to the user
  const [errorMessage, setErrorMessage] = useState("");

  // Controls whether the success popup should be visible
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Lets us disable the button while the request is running
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    // prev is the previous state object.
    // ...prev keeps the old values.
    // [name]: value updates only the field that changed.
    //  Det är om en användare skriver in sitt namn glömmer å skriva email så är namnet kvar
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page on form submit
    event.preventDefault();

    // Clear old errors before a new submit attempt
    setErrorMessage("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Fyll i både förnamn och efternamn.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Fyll i en e-postadress.");
      return;
    }

    if (!formData.password) {
      setErrorMessage("Fyll i ett lösenord.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Lösenorden matchar inte.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // JSON.stringify converts the JavaScript object
        // into JSON text that can be sent to the backend.
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      // response.ok is false for HTTP errors.
      // data.error handles errors returned by the API itself.
      if (!response.ok || data.error) {
        setErrorMessage(data.error ?? "Kunde inte skapa användaren.");
        return;
      }

      // Reset the form after a successful registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setShowSuccessModal(true);
    } catch {
      setErrorMessage("Något gick fel när kontot skulle skapas.");
    } finally {
      // finally always runs, no matter if try succeeded or failed.
      // Good place for cleanup, like stopping a loading state.
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="text-center">
        <h3 className="mb-4">Bli medlem!</h3>

        <Form onSubmit={handleSubmit}>
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

          {errorMessage && <p className="text-danger">{errorMessage}</p>}

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

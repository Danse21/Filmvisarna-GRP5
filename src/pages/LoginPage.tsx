import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Navigation route
LoginPage.route = {
  path: "/login",
  loginLabel: "Login",
  index: 6,
};

export default function LoginPage() {
  // Used to navigate back to StartPage when closing the Login page
  const navigate = useNavigate();

  return (
    <Container className="pt-5 pb-5" style={{ maxWidth: "420px" }}>
      {/* Add close button */}
      <button
        className="btn btn-link text-decoration-none mb-4"
        onClick={() => navigate("/")}
        aria-label="Close login page"
      >
        ✕ STÄNG
      </button>

      {/* Add login section */}
      <section className="mb-5 text-center">
        <h2 className="mb-4">Logga in!</h2>

        <Form>
          {/* Create email input field*/}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="E-post"
              className="text-center"
            />
          </Form.Group>

          {/* Create password input field */}
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Lösenord"
              className="text-center"
            />
          </Form.Group>

          {/* Add a submit button */}
          <Button variant="primary" className="w-100">
            Fortsätt
          </Button>
        </Form>
      </section>

      {/* Add Registeration section */}
      <section className="text-center">
        <h3 className="mb-4">Bli medlem!</h3>

        <Form>
          {/* Create name input field */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="För- och efternamn"
              className="text-center"
            />
          </Form.Group>

          {/* Create email input field */}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="E-post"
              className="text-center"
            />
          </Form.Group>

          {/* Create password input field */}
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Lösenord"
              className="text-center"
            />
          </Form.Group>

          {/* Create confirm password input field */}
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Bekräfta Lösenord"
              className="text-center"
            />
          </Form.Group>

          {/* Add a submit button */}
          <Button variant="primary" className="w-100">
            Fortsätt
          </Button>
        </Form>
      </section>
    </Container>
  );
}

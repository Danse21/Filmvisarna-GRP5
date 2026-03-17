import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../parts/RegisterForm";

// Route configuration used by the app router
LoginPage.route = {
  path: "/login",
  loginLabel: "Login",
  index: 6,
};

export default function LoginPage() {
  // Used to navigate back to the start page
  const navigate = useNavigate();

  return (
    <Container className="pt-5 pb-5" style={{ maxWidth: "420px" }}>
      <button
        className="btn btn-link text-dark p-0 text-decoration-none fw-bold mb-4"
        onClick={() => navigate("/")}
        aria-label="Close login page"
      >
        ✕ STÄNG
      </button>

      {/* Login section */}
      <section className="mb-5 text-center">
        <h2 className="mb-4">Logga in!</h2>

        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="E-post"
              className="text-center"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Lösenord"
              className="text-center"
            />
          </Form.Group>

          <Button variant="primary" className="w-100">
            Fortsätt
          </Button>
        </Form>
      </section>

      {/* Registration is split into its own component to keep this page smaller */}
      <RegisterForm />
    </Container>
  );
}

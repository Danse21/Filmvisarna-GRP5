import { Form } from "react-bootstrap";

// Props type for this component
// - email: current value of the email input
// - onChangeEmail: function that updates the email in the parent component
type Props = {
  email: string;
  onChangeEmail: (value: string) => void;
};

// Component that renders the email label and input field
export default function EmailInputField({ email, onChangeEmail }: Props) {
  return (
    <div>
      {/* Label for the email field */}
      {/* The red star (*) indicates that the field is required */}
      <span className="email-label-inline">
        <strong>
          Fyll i din Email: <span style={{ color: "red" }}>*</span>
        </strong>
      </span>

      {/* Container for the email input */}
      <div>
        <Form.Control
          className="email-input bg-dark bg-opacity-25 border-dark"
          // HTML input type for email validation
          type="email"
          // Placeholder text shown when the field is empty
          placeholder="example@email.com"
          // Controlled input value coming from parent state
          value={email}
          // When user types, send new value back to parent
          onChange={(e) => onChangeEmail(e.target.value)}
        />
      </div>
    </div>
  );
}

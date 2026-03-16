import { Form } from "react-bootstrap";

// This type defines the props that this component receives from its parent.
type Props = {
  email: string;
  onChangeEmail: (value: string) => void;
};

// This component renders the email label and the email input field.
export default function EmailInputField({ email, onChangeEmail }: Props) {
  return (
    <div>
      <span className="email-label-inline">
        {/* Show the email label with a red star to mark it as required */}
        <strong>
          Fyll i din Email: <span style={{ color: "red" }}>*</span>
        </strong>
      </span>

      {/* Email input field */}
      <div>
        <Form.Control
          className="email-input"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
        />
      </div>
    </div>
  );
}

import { Form } from "react-bootstrap";

// Props: data tht this component receives from its parent page (BookingSummaryPage)
// email: the current value typed by the user
// onChangeEmail: a function from the parent page that updates the email state

type Props = {
  email: string;
  onChangeEmail: (value: string) => void;
};

// This component is responsible only for rendering:
// the "Fyll i din Email:" label, and
// the email input field
export default function EmailInputField({ email, onChangeEmail }: Props) {
  return (
    <div>
      <span className="email-label-inline">
        {/* label shown above the email */}
        <strong>Fyll i din Email:</strong>
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

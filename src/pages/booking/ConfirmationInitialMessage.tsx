// This component renders the top text section of the confirmation page:
// title
// greeting text
export default function ConfirmationInitialMessage() {
  return (
    <>
      <h2 className="confirmation-title text-center mb-3">Bekräftelse</h2>

      <div className="confirmation-text mb-4">
        <p className="mb-1">Hej,</p>
        <p>Här kommer bokningsbekräftelse för dina biljetter.</p>
      </div>
    </>
  );
}

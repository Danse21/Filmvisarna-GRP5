// Props used by the reusable booking card component.
type Props = {
  date: string;
  totalPrice: number;
  movieTitle?: string;
  onClick?: () => void;
};

// Reusable booking card used on Mina bokningar page.
// It can be clickable or static depending on whether onClick is provided.
export default function MyBookingsCard({
  date,
  totalPrice,
  movieTitle,
  onClick,
}: Props) {
  const content = (
    <div className="my-booking-card__content">
      <div className="my-booking-card__center">
        <div className="my-booking-card__date">{date}</div>

        {/* Show movie title only when provided */}
        {movieTitle && (
          <div className="my-booking-card__title">{movieTitle}</div>
        )}
      </div>

      <div className="my-booking-card__price">{totalPrice} kr</div>
    </div>
  );

  // Render a button if the card should be clickable.
  if (onClick) {
    return (
      <button type="button" className="my-booking-card" onClick={onClick}>
        {content}
      </button>
    );
  }

  // Otherwise render a static div.
  return <div className="my-booking-card">{content}</div>;
}

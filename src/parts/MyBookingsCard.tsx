type Props = {
  date: string;
  totalPrice: number;
  movieTitle?: string;
  onClick?: () => void;
};

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
        {movieTitle && (
          <div className="my-booking-card__title">{movieTitle}</div>
        )}
      </div>

      <div className="my-booking-card__price">{totalPrice} kr</div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" className="my-booking-card" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className="my-booking-card">{content}</div>;
}

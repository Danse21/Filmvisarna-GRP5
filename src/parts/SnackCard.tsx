
import '../sass/snackspage.scss';

type Props = {
  snack: typeof SnackCard;
};

export default function SnackCard({ snack }: Props) {
  return (
    <div className="snack-row">
      <span className="snack-name">{snack.name}</span>

    </div>
  );
}
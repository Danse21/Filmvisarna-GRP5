
import '../sass/snackspage.scss';

type Snack = {
  name: string;
  price: string;
};

type Props = {
  snack: typeof SnackCard;
};

type SnackCard = {
  name: string;
  price: number;
};

export default function SnackCard({ snack }: Props) {
  return (
    <div className="snack-row">
      <span className="snack-name">{snack.name}</span>
    </div>
  );
}
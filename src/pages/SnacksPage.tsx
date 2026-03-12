import type { SnackCardDto } from "../interfaces/snackCardDto.ts";
import snackLoader from "../loaders/snackLoader";
import { useLoaderData } from "react-router-dom";

function Snackspage() {
  const snacks = useLoaderData() as SnackCardDto[];
  console.log(snacks);
  return (
    <div className="snacks-page">

      <h1 className="snacks-title">Snacks</h1>

      <div className="snacks-card">
        {snacks.map((snack) => (
          <div key={snack.id} className="snack-id">
            <span>{snack.name}</span>
            <span>{snack.price}</span>
          </div>
        ))}
      </div>

      <button className="snacks-info">
        Snacks köper du på plats!
      </button>

    </div>

  );
}

Snackspage.route = {
  path: "/snacks",
  menuLabel: "Snacks",
  index: 20,
  loader: snackLoader
};

export default Snackspage;
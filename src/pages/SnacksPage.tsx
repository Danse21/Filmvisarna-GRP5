

type Snack = {
  name: string;
  price: string;
};

const snacks: Snack[] = [
  { name: "Popcorn storlek S", price: "80:-" },
  { name: "Popcorn storlek M", price: "100:-" },
  { name: "Popcorn storlek L", price: "120:-" },
  { name: "Godis", price: "40:-" },
  { name: "Retro Cola", price: "45:-" },
  { name: "Kaffe & ostsmörgås", price: "85:-" },
  { name: "Kaffe & skinksmörgås", price: "85:-" },
];

function Snackspage() {
  return (
    <div className="snacks-page">

      <h1 className="snacks-title">Snacks</h1>

      <div className="snacks-card">
        {snacks.map((snack) => (
          <div className="snack-row" key={snack.name}>
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
};

export default Snackspage;
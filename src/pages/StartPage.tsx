StartPage.route = {
  path: '/',
  menuLabel: 'Start',
  index: 1
};

export default function StartPage() {
  return <div className="homepage-images">
    <img src="/images/movies/Pulp-Fiction.jpg" alt="Pulp-Fiction" />
    <br /><br />
    <img src="/images/movies/TheLord_of_the_rings.jpg" alt="The Lord of the Rings" />
    <br /><br />
    <img src="/images/movies/The-GodFather.jpg" alt="The GodFather" />
    <br /><br />
    <img src="/images/movies/StarWars.jpg" alt="Star wars" />
    <br /><br />
    <img src="/images/movies/TheShining.jpg" alt="The Shining" />
  </div>;
}
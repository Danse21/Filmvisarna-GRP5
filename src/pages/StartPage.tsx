StartPage.route = {
  path: "/",
  startLabel: "Start",
  index: 1,
};

export default function StartPage() {
  return (
    <div className="homepage-images">
      <img src="/images/movies/pulp-fiction.jpg" alt="Pulp Fiction" />
      <img
        src="/images/movies/lord-of-the-rings-fellowship-of-the-ring.jpg"
        alt="The Lord of the Rings"
      />
      <img src="/images/movies/the-godfather.jpg" alt="The GodFather" />
      <img src="/images/movies/star-wars-a-new-hope.jpg" alt="Star wars" />
      <img src="/images/movies/the-shining-1980.jpg" alt="The Shining" />
    </div>
  );
}

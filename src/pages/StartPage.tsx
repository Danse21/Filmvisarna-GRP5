import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Navigation route
StartPage.route = {
  path: "/",
  startLabel: "Start",
  index: 1,
};

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-images">
      {/* Add overlay buttons on the Pulp Fiction image */}
      <div className="pulp-fiction">
        {/* Movie image */}
        <img src="/images/movies/pulp-fiction.jpg" alt="Pulp Fiction" />

        {/* Overlay buttons */}
        <div className="pulp-fiction-buttons">
          <Button variant="primary" onClick={() => navigate("/booking")}>
            Biljetter
          </Button>

          <Button variant="secondary" onClick={() => navigate("/trailer")}>
            Trailer
          </Button>
        </div>
      </div>

      {/* Other movie images */}
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

import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Navigation route
MovieInfoPage.route = {
  path: "/movie-Info",
  movieInfoLabel: "Movie-Info",
  index: 7,
};

export default function MovieInfoPage() {
  const navigate = useNavigate();

  return (
    <Container className="pt-4 pb-5">
      {/* Upper section of the page */}
      <Row className="mb-4 align-items-stretch">
        <Col md={6}>
          <div className="movie-image-block">
            <img
              src="/images/movies/Pulp_fiction.jpg"
              alt="Pulp Fiction"
              className="movie-info-image img-fluid mb-3"
            />

            {/* Create link to navigate to TrailerPage */}
            <Button variant="secondary" onClick={() => navigate("/trailer")}>
              Se Trailer
            </Button>
          </div>
        </Col>

        {/* Add movie description */}
        <Col md={6}>
          <div className="movie-text-block h-100">
            <p className="mb-0">
              Två yrkesmördare, en proffsboxare, en gangsters fru och ett par
              banditer sammanstrålar i den här skruvade, blodsprängda resan
              genom Los Angeles mörka hjärta.
            </p>
          </div>
        </Col>
      </Row>

      {/* Drink tips info */}
      <Row className="align-items-stretch">
        <Col md={6}>
          <div className="movie-text-block text-center h-100">
            <h6 className="mb-2">Drink Tips:</h6>
            <p className="mb-0">Milkshake (Boozy twist)</p>
            <p className="mb-0">
              En blinkning till Mia & Vincents ikoniska scen. Bourbon eller rom
            </p>
            <p className="mb-0">Vaniljglass</p>
            <p className="mb-0">En skvätt Baileys</p>
            <p className="mb-0">Lite mjölk</p>
          </div>
        </Col>

        {/* Movie facts */}
        <Col md={6}>
          <div className="movie-text-block text-center h-100">
            <ul className="list-unstyled mb=0 movie-facts">
              <li>Skådespelare:</li>
              <li>John Travolta, Uma Thurman,</li>
              <li>Samuel L. Jackson</li>
              <li>Regissör: Quentin Tarantino</li>
              <li>1992</li>
              <li>längd: 2h 34 min</li>
              <li>Åldersgräns: 15 år</li>
              <li>Genre: Kriminal/Thriller</li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Create salong and time options selection  */}
      <section className="mt-5">
        <h4 className="mb-3 text-start">Välj visning</h4>

        <Row className="g-3">
          <Col md={3}>
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() => navigate("/booking")}
            >
              3/2
              <br />
              Stora Salongen
              <br />
              20.00
            </Button>
          </Col>

          <Col md={3}>
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() => navigate("/booking")}
            >
              4/2
              <br />
              Stora Salongen
              <br />
              15.00
            </Button>
          </Col>

          <Col md={3}>
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() => navigate("/booking")}
            >
              4/2
              <br />
              Stora Salongen
              <br />
              20.00
            </Button>
          </Col>

          <Col md={3}>
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() => navigate("/booking")}
            >
              5/2
              <br />
              Stora Salongen
              <br />
              20.00
            </Button>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

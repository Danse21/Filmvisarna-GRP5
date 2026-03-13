import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

MoviesOfTheDay.route = {
  path: "/filmer/:date",
  index: 14,
};

export default MoviesOfTheDay;


function MoviesOfTheDay() {
  const { date } = useParams();

  return (
    <Container>
      <h1>Filmer för {date}</h1>
    </Container>
  );
}


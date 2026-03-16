// Import hooks från React Router
// useLoaderData → hämtar data från loadern
// useParams → hämtar parametrar från URL (t.ex. /filmer/:date)
import { useLoaderData, useParams } from "react-router-dom";

// Bootstrap layout-komponenter
import { Container, Row, Col } from "react-bootstrap";

// MovieCard-komponenten som visar filmens info
import MovieCard from "../parts/movieCard";

// Modal för att visa trailer
import TrailerModal from "../utils/trailerModal";

// React state-hook
import { useState } from "react";

// TypeScript-interface för filmdata
import type { MovieCardDto } from "../interfaces/moviecardDto";

// Loader som hämtar filmer från backend
import moviesOfTheDayLoader from "../loaders/moviesOfTheDayLoader";


// Router-konfiguration för denna sida
MoviesOfTheDay.route = {
  path: "/filmer/:date",          // URL ex: /filmer/2026-03-13
  loader: moviesOfTheDayLoader,   // loader som hämtar filmer
  index: 14,
};


export default function MoviesOfTheDay() {

  // Hämtar filmer som loadern returnerar
  const movies = useLoaderData() as MovieCardDto[];

  // Hämtar datum från URL
  const { date } = useParams();

  // State för trailer-modal
  const [showTrailer, setShowTrailer] = useState(false);


  // Skapa Date-objekt av datumet i URL
  const selectedDate = new Date(date!);

  // Skapa dagens datum
  const today = new Date();

  // Skapa morgondagens datum
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);


  // Funktion som jämför två datum (ignorerar tid)
  function isSameDay(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
  }


  // Variabel som kommer innehålla rubriktext
  let label = "";

  // Om datumet är idag
  if (isSameDay(selectedDate, today)) {
    label = `Idag ${selectedDate.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long"
    })}`;
  }

  // Om datumet är imorgon
  else if (isSameDay(selectedDate, tomorrow)) {
    label = `Imorgon ${selectedDate.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long"
    })}`;
  }

  // Annars visa veckodag + datum
  else {
    label = selectedDate.toLocaleDateString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  return (

    // Bootstrap container som centrerar innehållet och den stretchar ut.
    <Container fluid className="movies-of-the-day pt-5 mt-3 px-4">

      {/* Rubrik för sidan */}
      <h1 className="text-center mb-4">
        Filmer {label}
      </h1>


      {/* Grid med filmer */}
      <Row className="g-4 justify-content-center">

        {/* Loopa igenom filmer och skapa ett MovieCard för varje */}
        {movies.map((movie) => (

          // Bootstrap grid
          // xs=12 → 1 film per rad på mobil
          // md=6 → 2 filmer per rad på desktop
          <Col xs={12} md={6} key={movie.slug}>

            {/* MovieCard komponent */}
            <MovieCard movie={movie} />

          </Col>

        ))}
      </Row>


      {/* Trailer modal */}
      {/* Visar trailer för första filmen i listan */}
      <TrailerModal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        trailerUrl={movies[0]?.trailer_link}
      />

    </Container>
  );
}
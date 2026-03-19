import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../parts/movieCard";
import HeroCard from "../parts/heroCard";
import DateSelector from "../parts/dateSelector";
import startPageLoader from "../loaders/startPageLoader";
import { useLoaderData } from "react-router-dom";
import type { StartPageDto } from "../interfaces/startPageDto";

// Navigation route
StartPage.route = {
  path: "/",
  startLabel: "Start",
  loader: startPageLoader,
  index: 1,
};

export default function StartPage() {
  // State som håller alla filmer vi hämtar från databasen
  const { movies } = useLoaderData() as StartPageDto;




  return (
    <Container fluid className="pb-4 px-0 px-md-2 min-vh-100" >

      {/* Första filmen som hero-kort i full bredd */}
      {movies.length > 0 && (
        <Row className="mx-n2">
          <Col xs={12} className="px-0">
            <HeroCard movies={movies} />
          </Col>
        </Row>
      )}
      {/* Kalender / Datumväljare */}
      <DateSelector />

      {/* Resten av filmerna: 4 per rad och det är dom första unika kommande visningarna*/}
      <Row className="g-2">
        {movies.map((movie) => (
          <Col xs={12} md={4} key={movie.slug} className="px-1 px-md-1">
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

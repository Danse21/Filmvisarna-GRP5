import { Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/sass/_dateselector.scss";

// Arrayen börjar med Söndag eftersom Javascript getDay()
// returnerar 0 för Söndag, 1 för måndag osv.
const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

// förkortningar som används på mobil där utrymmet är begränsat.
const weekdaysShort = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

// Skapar en lista med 14 datum: idag + 13 dagar framåt
function getUpcomingDates() {
  const dates = [];

  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);

    // flytta datum framåt
    d.setDate(today.getDate() + i);

    // Formatera som "dag/månad"
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;

    // Skapa även datum i URL-format: YYYY-MM-DD
    // toISOString() ger t.ex. "2026-03-13T00:00:00.000Z"
    // split("T")[0] tar bara datumdelen → "2026-03-13"
    const urlDate = d.toISOString().split("T")[0];

    // Första dagarna får specialnamn
    let label = "";
    if (i === 0) label = "Idag";
    else if (i === 1) label = "Imorgon";
    else label = weekdays[d.getDay()];

    // förkortningar för mobil
    let shortLabel = "";
    if (i === 0) shortLabel = "Idag";
    else if (i === 1) shortLabel = "Imon";
    else shortLabel = weekdaysShort[d.getDay()];

    dates.push({
      label,
      shortLabel,
      date: dateStr,
      urlDate
    });
  }

  return dates;
}

export default function DateSelector() {

  // startIndex bestämmer vilka 5 dagar som visas
  const [startIndex, setStartIndex] = useState(0);

  // React Router navigation
  const navigate = useNavigate();

  const dates = getUpcomingDates();

  // visa bara 5 åt gången
  const visibleDates = dates.slice(startIndex, startIndex + 5);

  return (
    // huvudcontainer
    // position relative behövs för att kunna placera pilarna i kanterna
    <div style={{ position: "relative", width: "100%", padding: "1rem 0" }}>

      {/* VÄNSTER PIL */}
      <button
        className="date-arrow"
        style={{ left: 0 }}
        onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
        disabled={startIndex === 0}
      >
        &lt;
      </button>

      {/* DATUMRAD */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          width: "100%",
          padding: "0 4px"
        }}
      >
        {visibleDates.map((item, index) => (

          <div key={index} className="date-card">

            <Card
              className="bg-primary text-center rounded-3 text-black"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/filmer/${item.urlDate}`)}
            >

              {/* Card.Body = innehållet i kortet */}
              <Card.Body className="d-flex flex-column justify-content-center p-2">

                {/* Veckodag — förkortning på mobil, långt på desktop */}
                {/* d-md-none = visas BARA på mobil (döljs på desktop) */}
                {/* d-none d-md-block = visas bara på desktop (döljs på mobil) */}
                <Card.Title className="mb-0 text-black d-md-none" style={{ fontSize: "0.85rem" }}>
                  {item.shortLabel}
                </Card.Title>
                {/* Veckodag */}
                <Card.Title className="text-black d-none d-md-block fs-5">
                  {item.label}
                </Card.Title>

                {/* Datum */}
                <Card.Text className="mb-0 text-black fw-bold" style={{ fontSize: "1rem" }}>
                  {item.date}
                </Card.Text>

              </Card.Body>

            </Card>

          </div>

        ))}
      </div>

      {/* HÖGER PIL */}
      <button
        className="date-arrow"
        style={{ right: 0 }}
        onClick={() => setStartIndex(Math.min(dates.length - 5, startIndex + 1))}
        disabled={startIndex >= dates.length - 5}
      >
        &gt;
      </button>

    </div>
  );
}
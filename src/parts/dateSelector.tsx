import { Row, Col, Card } from "react-bootstrap";


// Arrayen börjar med Söndag för Javascript getDay() retunerar 0 för Söndag, 1 för måndag osv..
const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

// Skapar en lista med 4 datum, idag + 3 dagar framåt
function getUpcomingDates() {
  const dates = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date();
    // setDate flyttar datumet framåt med i dagar
    // Om i=0 blir det idag, i=1 imorgon osv.
    d.setDate(d.getDate() + i);

    // Formatera som "dag/månad", t.ex. "5/3"
    // getMonth() är 0-baserad (januari=0) så vi lägger till 1
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;

    // Första dagen kallas "Idag", andra "Imorgon"
    // Resten får sitt veckodagsnamn från vår array
    let label = "";
    if (i === 0) label = "Idag";
    else if (i === 1) label = "Imorgon";
    else label = weekdays[d.getDay()];

    dates.push({ label, date: dateStr });
  }
  return dates;
}

export default function DateSelector() {
  // Hämta de 5 datumen — körs varje gång komponenten renderas
  const dates = getUpcomingDates();

  return (
    // g-2 = gap mellan korten
    // py-3 = padding ovanför och under raden
    // align-items-stretch = alla kolumner blir lika höga
    <Row className="g-2 py-3 align-items-stretch">
      {/* Loopa igenom alla 5 datum och skapa ett kort för varje */}
      {dates.map((item, index) => (
        // Col utan siffra = alla kolumner delar bredden lika (25% var)
        <Col key={index}>
          {/* h-100 = kortet fyller hela kolumnens höjd */}
          <Card
            className="bg-primary text-center h-100 rounded-3 text-black border-dark shadow"
          >
            {/* Card.Body = innehållet inuti kortet */}
            {/* d-flex flex-column = staplar label och datum vertikalt */}
            {/* justify-content-center = centrerar innehållet vertikalt */}
            <Card.Body
              className="d-flex flex-column justify-content-center"
            >
              {/* Card.Title = dagens namn (Idag, Imorgon, Onsdag...) */}
              <Card.Title
                className="fs-5 text-black"
              >
                {item.label}
              </Card.Title>

              {/* Card.Text = datumet (5/3, 6/3...) */}
              {/* fs-4 = stort datum*/}
              <Card.Text
                className="fs-4 text-black"
              >
                {item.date}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <>
      <footer className="bg-dark text-light mt-5 pt-4 pb-4">
        <Container>
          {/* two columns in 1 row */}
          <Row className="mb-3">
            <Col xs={6} md={6}>
              <h5 className="mb-3">Kontakt</h5>
              <p className="mb-1">Info@Retro-cinema.com </p>
              <p className="mb-1">Riksgränsen 981 94</p>
              <p className="mb-1">+46 000 00 0</p>
            </Col>
            <Col xs={6} md={6}>
              <h5 className="mb-3">Öppettider</h5>
              <p className="mb-1">Måndag: 17:00-23:00</p>
              <p className="mb-1">Tisdag-Torsdag: 09:00-23:00</p>
              <p className="mb-1">Fredag: 09:00-00:00</p>
              <p className="mb-1">Lördag: 10:00-00:00</p>
              <p className="mb-1">Söndag: 10:00-23:00</p>
            </Col>
          </Row>
          {/* Another row: text centered */}
          <Row>
            <Col className="text-center pt-3 border-top border-secondary">
              © Retro Cinema {new Date().getFullYear()}
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

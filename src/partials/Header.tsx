import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    //Css styling class som man måste skapa för att den ska göra något//
    <header className="navbar">
      <h1>
        <strong>Retro Cinema</strong>
      </h1>
      <div>
        <FontAwesomeIcon icon={faBars} />
        <nav className="menuToggle">
          <ul className="menu">
            <li>
              <a href="#minabokningar">Mina Bokningar</a>
            </li>
            <li>
              <a href="#filmer">Filmer</a>
            </li>
            <li>
              <a href="#snacks">Snacks</a>
            </li>
            <li>
              <a href="#presentkort">Presentkort</a>
            </li>
            <li>
              <a href="#avbokning">Avbokning</a>
            </li>
            <li>
              <a href="#kalender">Kalender</a>
            </li>
            <li>
              <a href="#chattamedbengt">Chatta med Bengt</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="menu-icons">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <br />
        <FontAwesomeIcon icon={faUser} />
      </div>
    </header>
  );
}

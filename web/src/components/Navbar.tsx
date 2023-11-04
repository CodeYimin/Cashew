import { css } from "@emotion/css";
import { ReactElement } from "react";
import "./Navbar.css";

interface NavbarProps {}

function Navbar({}: NavbarProps): ReactElement {
  return (
    <nav
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <a className="navbar-title" href="/">
        Cashew
      </a>
      <ul>
        <li>
          <a href="/login">Login</a>
        </li>
        <li>
          <a href="/course">Cart</a>
        </li>
        <li>
          <a href="/timetable">Timetable</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

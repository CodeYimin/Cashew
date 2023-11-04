import { css } from "@emotion/css";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
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
      <Link className="navbar-title" to="/">
        Cashew
      </Link>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/course">Cart</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

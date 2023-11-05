import { css } from "@emotion/css";
import { ReactElement } from "react";
import "./Navbar.css";
import login from "./images/User_alt3x.png";
import cart from "./images/cart.png";

interface NavbarProps {}

function Navbar({}: NavbarProps): ReactElement {
  return (
    <nav
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #347072;
        height: 14.564%;
        margin: 0;
        padding: 0;
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
      <div className="icons">
        <img src={login} style={{ height: "1.5rem" }} alt="" />
        <img src={cart} style={{ height: "1.5rem" }} alt="" />
      </div>
    </nav>
  );
}

export default Navbar;

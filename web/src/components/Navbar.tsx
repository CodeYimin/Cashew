import { css } from "@emotion/css";
import { ReactElement, useState } from "react";
import "./Navbar.css";
import logo from "./images/Group_8.png";
import login from "./images/User_alt3x.png";
import cart from "./images/cart.png";
interface NavbarProps {}

function Navbar({}: NavbarProps): ReactElement {
  const [sidebar, setSidebar] = useState(false);
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
        <img src={logo} style={{ height: "5rem" }} />
        Cashew
      </a>
      <ul>
        <li>
          <a href="/course">Pathway Explorer</a>
        </li>
        <li>
          <a href="/timetable">Timetable</a>
        </li>
      </ul>
      <div className="icons">
        <button>
          <img src={login} style={{ height: "1.5rem" }} alt="" />
        </button>

        <button>
          <img src={cart} style={{ height: "1.5rem" }} alt="" />
        </button>
      </div>

      {/* <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle"></li>
        </ul>
      </nav> */}
    </nav>
  );
}

export default Navbar;

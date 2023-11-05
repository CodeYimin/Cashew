import { ReactElement } from "react";
import "./Navbar.css";
import logo from "./images/Group_8.png";

interface FooterProps {
  a?: string;
}

function Footer({ a }: FooterProps): ReactElement {
  return (
    <div className="footer">
      <div className="column1">
        <div className="column">
          <img src={logo} alt="" />
          <div className="title">Cashew</div>
        </div>

        <div className="column">
          <div className="heading">Contact</div>
          <a href="">Instagram</a>
          <a href="">Facebook</a>
          <a href="">Linkedin</a>
          <a href="">Twitter</a>
        </div>
        <div className="column">
          <div className="heading">Resources</div>
          <a href="">Programs</a>
          <a href="">Faculty</a>
        </div>
        <div className="column">
          <div className="heading">Legal</div>
          <a href="">Term & Conditions</a>
          <a href="">Conde of Condust</a>
          <a href="">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;

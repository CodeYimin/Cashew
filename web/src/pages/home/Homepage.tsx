import { css } from "@emotion/css";
import { ReactElement } from "react";
import pic from "../../components/images/Rectangle_451.png";
import hand from "../../components/images/Vector_3.png";
import clock from "../../components/images/clock.png";
import face from "../../components/images/happysmilehappy_facesmileyemojigrin.png";
import "./homepage.css";
interface HomepageProps {
  a?: string;
}

function Homepage({ a }: HomepageProps): ReactElement {
  return (
    <div className="homepage">
      <div className="title">
        <div>Welcome to University of Toronto</div>
        <div className={`padding: 20 0 20 0`}></div>
        <div>Course Pathway Portal</div>
        <a href="/homepagesearch">Get Started</a>
      </div>
      <div
        className={css`
          height: 50vh;
        `}
      ></div>
      <div className="panels">
        <div className="panel1">
          <img src={clock} style={{ height: "10rem" }} alt="" />
          Immediate access to course pathways
        </div>
        <div className="panel1">
          <img src={hand} style={{ height: "10rem" }} alt="" />
          Easy course planning
        </div>
        <div className="panel1">
          <img src={face} style={{ height: "10rem" }} alt="" />
          Stress free future
        </div>
      </div>
      <div className="final-panel">
        <div className="text">
          <div className="title">It Starts With You!</div>
          <p>
            Find details about your available course pathways easily using our
            portal. Those who have taken similar courses at a different
            institution may be eligible for advanced standing. Please contact
            your student learning center at your home campus to make a request.
          </p>
          <div className="phone-numbers">
            <h1>St.George Campus (416) 978-2011.</h1>
            <h1>Scarborough Campus (416) 287-8872</h1>
            <h1>Missisauga Campus (905) 569-4455</h1>
          </div>
        </div>
        <div className="Picture">
          <img src={pic} style={{ height: "30rem" }} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;

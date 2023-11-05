import { ReactElement } from "react";
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
    </div>
  );
}

export default Homepage;

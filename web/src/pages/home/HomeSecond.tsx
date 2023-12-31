import { ReactElement } from "react";
import SearchBar from "./components/SearchBar";
import "./homepage.css";

interface HomeSecondProps {
  a?: string;
}

function HomeSecond({ a }: HomeSecondProps): ReactElement {
  return (
    <div className="homepage2">
      <div className="search-bar">
        <div className="text">
          Search a course and find where these options can take you
        </div>
        <SearchBar />
      </div>
    </div>
  );
}

export default HomeSecond;

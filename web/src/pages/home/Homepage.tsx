import { ReactElement } from "react";
import SearchBar from "./components/SearchBar";

interface HomepageProps {
  a?: string;
}

function Homepage({ a }: HomepageProps): ReactElement {
  return (
    <div>
      <SearchBar />
    </div>
  );
}

export default Homepage;
